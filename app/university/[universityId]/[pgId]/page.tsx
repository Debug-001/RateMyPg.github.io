"use client";
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import NavAddress from "@/components/NavAddress";
import { useAuth } from "@/context/AuthContext";
import { CiLocationOn } from "react-icons/ci";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

interface University {
  id: string;
  name: string;
  address: string;
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  userName: string;
  userPhotoURL: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  text: string;
  userName: string;
  userPhotoURL: string;
}

const PgDetailsPage = ({ params }) => {
  const { user } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [pg, setPg] = useState(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const { universityId, pgId } = params;

  useEffect(() => {
    const fetchPgData = async () => {
      if (!universityId || !pgId) return;

      try {
        const universityDoc = doc(db, "universities", universityId);
        const universitySnapshot = await getDoc(universityDoc);
        if (universitySnapshot.exists()) {
          setUniversity({
            id: universitySnapshot.id,
            ...universitySnapshot.data(),
          } as University);
        }

        const pgDoc = doc(db, "universities", universityId, "pgs", pgId);
        const pgSnapshot = await getDoc(pgDoc);
        if (pgSnapshot.exists()) {
          setPg({
            id: pgSnapshot.id,
            ...pgSnapshot.data(),
          });
        }

        const commentsCollection = collection(
          db,
          "universities",
          universityId,
          "pgs",
          pgId,
          "comments"
        );

        onSnapshot(commentsCollection, async (snapshot) => {
          const updatedComments = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const commentData = {
                id: doc.id,
                ...doc.data(),
                replies: [],
              } as Comment;

              const repliesCollection = collection(
                db,
                "universities",
                universityId,
                "pgs",
                pgId,
                "comments",
                doc.id,
                "replies"
              );

              onSnapshot(repliesCollection, (repliesSnapshot) => {
                const replies = repliesSnapshot.docs.map((replyDoc) => ({
                  id: replyDoc.id,
                  ...replyDoc.data(),
                })) as Reply[];
                commentData.replies = replies;
                setComments((prevComments) =>
                  prevComments.map((c) =>
                    c.id === commentData.id ? commentData : c
                  )
                );
              });

              return commentData;
            })
          );
          setComments(updatedComments);
        });
      } catch (error) {
        console.error("Error fetching PG data: ", error);
      }
    };

    fetchPgData();
  }, [universityId, pgId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addDoc(
        collection(db, "universities", universityId, "pgs", pgId, "comments"),
        {
          text: newComment,
          userId: user.uid,
          userName: user.displayName,
          userPhotoURL: user.photoURL,
          timestamp: new Date(),
        }
      );
      setNewComment("");
      toast.success("Comment Added");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(
        doc(
          db,
          "universities",
          universityId,
          "pgs",
          pgId,
          "comments",
          commentId
        )
      );
      toast.success("Comment Deleted");
    } catch (error) {
      console.error("Error deleting comment: ", error);
      toast.error("Error deleting Comment");
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    try {
      await addDoc(
        collection(
          db,
          "universities",
          universityId,
          "pgs",
          pgId,
          "comments",
          commentId,
          "replies"
        ),
        {
          text: replyText,
          userId: user.uid,
          userName: user.displayName,
          userPhotoURL: user.photoURL,
          timestamp: new Date(),
        }
      );
      setReplyText("");
      setActiveReply(null);
      toast.success("Reply Added");
    } catch (error) {
      console.error("Error adding reply: ", error);
      toast.error("Error Replying");
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      await deleteDoc(
        doc(
          db,
          "universities",
          universityId,
          "pgs",
          pgId,
          "comments",
          commentId,
          "replies",
          replyId
        )
      );
      toast.success("Reply Deleted");
    } catch (error) {
      console.error("Error deleting reply: ", error);
      toast.error("Error deleting reply");
    }
  };

  const highlightMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    return text.split(mentionRegex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-primary font-weight-bold">
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  if (!pg) return null;

  return (
    <>
      <Navbar />
      <div
        className="container-fluid top-section"
        style={{
          backgroundImage: `url(/uni.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <div
          className="container d-flex flex-column justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          <h1 className="display-4 text-white fw-bolder text-center">
            {pg?.name || "PG Not Found"}
          </h1>
          <p className="text-white fs-4">
            {university?.name || "University Not Found"}
          </p>
          <p>Ratings</p>
        </div>
      </div>
      <div className="container">
        <NavAddress />
        <div className="d-flex flex-column">
          <h1 className="fs-1 fw-bold mt-5">
            Pg <span className="px-1 text-primary">Details</span>
          </h1>
          <hr />
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title fs-2"> {pg?.name || "PG Not Found"}</h5>
            <p className="card-text">
              <small className="text-muted">
                <CiLocationOn size={22} /> {pg.location || "Not provided"}
              </small>
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{pg.contact || "Not provided"}</li>
          </ul>
          <div className="card-body">
            <h2 className="fs-3">Reviews:</h2>
            <div className="mb-3 d-flex gap-2 align-items-center">
              <Image
                src={user.photoURL}
                width={40}
                height={40}
                className="rounded-pill"
                alt="profile-img"
              />
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="btn btn-primary ms-2"
                onClick={handleAddComment}
              >
                Submit
              </button>
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className="mb-3">
                <div className="d-flex gap-2 align-items-center">
                  <Image
                    src={comment.userPhotoURL}
                    width={40}
                    height={40}
                    className="rounded-pill"
                    alt="profile-img"
                  />
                  <p className="fw-bold mb-0">{comment.userName}</p>
                  <p className="mb-0">{highlightMentions(comment.text)}</p>
                  {comment.userId === user.uid && (
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-link ms-2"
                    onClick={() =>
                      setActiveReply(
                        activeReply === comment.id ? null : comment.id
                      )
                    }
                  >
                    Reply
                  </button>
                </div>
                {activeReply === comment.id && (
                  <div className="mt-2 d-flex gap-2">
                    <Image
                      src={user.photoURL}
                      width={30}
                      height={30}
                      className="rounded-pill"
                      alt="reply-img"
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddReply(comment.id)}
                    >
                      Submit
                    </button>
                  </div>
                )}
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="mt-2 ms-4">
                    <div className="d-flex gap-2 align-items-center">
                      <Image
                        src={reply.userPhotoURL}
                        width={30}
                        height={30}
                        className="rounded-pill"
                        alt="reply-img"
                      />
                      <p className="fw-bold mb-0">{reply.userName}</p>
                      <p className="mb-0">{highlightMentions(reply.text)}</p>
                      {reply.userId === user.uid && (
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() =>
                            handleDeleteReply(comment.id, reply.id)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export default PgDetailsPage;
