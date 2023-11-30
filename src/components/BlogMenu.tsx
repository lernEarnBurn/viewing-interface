import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BlogSkeleton } from "./ui/BlogSkeleton";

interface Blog {
  _id: string;
  author: User;
  content: string;
  title: string;
}

interface User {
  _id: string;
  username: string;
  password: string;
}

export function BlogMenu() {
  const { blogs, loading } = useFetchAllBlogs();

  const navigate = useNavigate();
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);
  //to catch up the itemsRef
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, blogs.length);
  }, [blogs]);

  function transitionToBlogPage(blog: Blog, index: number): void {
    if (itemsRef.current && itemsRef.current[index]) {
      itemsRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const updatedBlogs = [
      blog,
      ...blogs.slice(0, index),
      ...blogs.slice(index + 1),
    ];

    localStorage.setItem("allBlogs", JSON.stringify(updatedBlogs));
    localStorage.setItem("selectedBlog", JSON.stringify(blog));

    setTimeout(() => {
      navigate(`/viewing-interface/blogs/${blog._id}`);
    }, 350);
  }

  return (
    <>
      <div className="fix-bg-bug"></div>
      <div className="top-div relative top-24 flex flex-col gap-4 overflow-y-auto min-h-[100vh] min-w-[99vw] items-center pb-10">
        {!loading ? (
          blogs.map((blog, index) => (
            <div
              ref={(elem) => (itemsRef.current[index] = elem)}
              onClick={() => transitionToBlogPage(blog, index)}
              className="z-10 rounded-lg dark:bg-opacity-90 mt-[4.5vh] py-2 px-10 border-2 light:border-black shadow-sm w-[35vw] h-[87vh] overflow-hidden"
              key={blog._id}
            >
              <h2 className="text-center text-2xl">
                <strong>{blog.title}</strong>
              </h2>
              <h3 className="text-center text-sm">
                By{" "}
                {blog.author && blog.author.username
                  ? blog.author.username
                  : "changeWhenCanCreateBlogs"}
              </h3>
              <p className="mt-2 text-md">{blog.content}</p>
            </div>
          ))
        ) : (
          <BlogSkeleton />
        )}
      </div>
    </>
  );
}

function useFetchAllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllBlogs = async () => {
      const storedBlogs = localStorage.getItem("allBlogs");

      if (storedBlogs) {
        setBlogs(JSON.parse(storedBlogs));
      } else {
        try {
          setLoading(true);
          const response = await axios.get("http://13.58.53.141:3000/posts");
          setBlogs(response.data);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getAllBlogs();
  }, []);

  return { blogs, loading };
}
