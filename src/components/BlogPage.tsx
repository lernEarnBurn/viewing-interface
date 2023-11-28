import { PageAnimation } from "./PageAnimation";
import { BtnBar } from "./BackBar";
import { CommentSection } from "./CommentSection";

import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function BlogPage() {
  const postId: string = useParams().postId || "";

  //this is done to ensure to ensure a clean transition and avoid another query
  const storedBlogData = localStorage.getItem("selectedBlog");
  const blogData = storedBlogData ? JSON.parse(storedBlogData) : null;

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const toComments = () => {
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="scroller overflow-y-scroll h-[100.01vh] snap-y snap-mandatory">
      <section className="h-[100vh] w-[100vw] grid place-items-center snap-start">
        <PageAnimation>
          <div className="flex flex-col  z-10 rounded-lg dark:bg-opacity-90 py-2 px-10 border-2 light:border-black shadow-sm w-[35vw] h-[87vh] overflow-hidden">
            <h2 className="text-center text-2xl">
              <strong>{blogData?.title || "No Title"}</strong>
            </h2>
            <h3 className="text-center text-sm">
              By {blogData?.author?.username || "changeWhenCanCreateBlogs"}
            </h3>
            <p className="mt-2 text-md">{blogData?.content || "No Content"}</p>
          </div>
          <BtnBar backFunc={handleGoBack} toCommentsFunc={toComments}></BtnBar>
        </PageAnimation>
      </section>
      <section
        ref={sectionRef}
        className="grid place-items-center h-[100vh] snap-start "
      >
        <CommentSection postId={postId} />
      </section>
    </div>
  );
}
