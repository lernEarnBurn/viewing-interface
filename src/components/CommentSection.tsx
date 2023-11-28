import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { Comment } from "./ui/comment";
import { Card, CardContent, CardTitle, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizontal } from "lucide-react";

interface CommentSectionProps {
  postId: string;
}

interface User {
  _id: string;
  username: string;
  password: string;
}

type Comment = {
  id: string;
  author: User;
  post: string;
  content: string;
};

export function CommentSection(props: CommentSectionProps) {
  const { loading, comments } = useFetchPostComments(props.postId);
  const { contentRef, createComment } = useCreateComment(props.postId);

  return (
    <>
      <Card className="w-[30vw] h-[75vh] py-2 flex flex-col">
        <CardTitle className="comment-title text-center mt-3 mb-2">
          Comments
        </CardTitle>
        <CardContent className="w-full h-[55vh] flex flex-col items-center overflow-y-scroll overflow-x-hidden">
          {comments.map((comment, index) => (
            <Comment
              key={index}
              author={comment.author.username}
              content={comment.content}
            />
          ))}
        </CardContent>
        <CardFooter className="flex gap-3 items-center justify-center border-t">
          <Input
            ref={contentRef}
            className="mt-8"
            type="text"
            placeholder="Add a comment..."
          />
          {!loading ? (
            <Button
              onClick={createComment}
              size="icon"
              className="p-0 m-0 mt-8 rounded-full h-9 w-10 comment-button hover:scale-[1.03] grid place-items-center"
            >
              <SendHorizontal className="icon h-[2.5vh] w-[2.5vw]" />
            </Button>
          ) : (
            <Button
              disabled
              className="p-0 m-0 mt-8 rounded-full h-9 w-10 comment-button hover:scale-[1.03] grid place-items-center"
            >
              <SendHorizontal className="icon  h-[2.5vh] w-[2.5vw]" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

function useFetchPostComments(postId: string) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/posts/${postId}/comments`,
        );
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPostComments();
  }, [postId]);

  return { loading, comments };
}

function useCreateComment(postId: string) {
  const contentRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const createComment = async () => {
    if (
      localStorage.getItem("token") &&
      contentRef.current?.value.trim() !== "" &&
      contentRef.current?.value
    ) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };

        const data = {
          author: localStorage.getItem("username"),
          post: postId,
          content: contentRef.current?.value.trim() || "",
        };

        await axios.post(
          `http://localhost:3000/posts/${postId}/comments`,
          data,
          config,
        );

        


        // Handle the logic for updating state or UI as needed

        contentRef.current.value = "";
      } catch (err) {
        console.log(err);
      }
    } else {
      navigate("/");
    }
  };

  return { contentRef, createComment };
}
