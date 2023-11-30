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
  //I know these should be together if i'm gonna couple the code like this
  const { loading, comments, setComments } = useFetchPostComments(props.postId);
  const { contentRef, createComment } = useCreateComment(props.postId, setComments);


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
          `http://13.58.53.141:3000/posts/${postId}/comments`,
        );
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPostComments();
  }, [postId]);

  return { loading, comments, setComments };
}

function useCreateComment(postId: string, setComments: React.Dispatch<React.SetStateAction<Comment[]>>) {
  const contentRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const createComment = async () => {
    if (
      localStorage.getItem("token") &&
      contentRef.current?.value.trim() !== "" &&
      contentRef.current?.value
    ) {
      try {
        const userStorage = localStorage.getItem("username");
        let user
        if (typeof userStorage === 'string') {
           user = JSON.parse(userStorage);
        } else {
           user = {
            _id: '123',
            username: "John Doe",
            password: 'n/a'
          };
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };
        
        const data: Comment = {
          id: '123',
          author: user || {
            _id: '123',
            username: "John Doe",
            password: 'n/a'
          },
          post: postId,
          content: contentRef.current?.value.trim() || "",
        };

        await axios.post(
          `http://13.58.53.141:3000/posts/${postId}/comments`,
          data,
          config,
        );
        
        setComments((prev: Comment[]) => [...prev, data]);

        contentRef.current.value = "";
      } catch (err) {
        console.log(err);
      }
    } else {
      navigate("/viewing-interface/");
    }
  };

  return { contentRef, createComment };
}
