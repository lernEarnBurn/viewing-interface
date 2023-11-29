import { ModeToggle } from "./mode-toggle";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

interface navBarProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar(props: navBarProps) {
  const navigate = useNavigate();

  function logOut(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("allBlogs");
    localStorage.removeItem("selectedBlog");
    localStorage.removeItem("username");
    props.setLoggedIn(false);
    navigate("/viewing-interface/");
  }

  const [scrolledDown, setScrolledDown] = useState(false);

  //need to have this hidden for when the animation fades out

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0 && !scrolledDown) {
        setScrolledDown(true);
      } else if (window.scrollY === 0 && scrolledDown) {
        setScrolledDown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolledDown]);

  const location = useLocation();

  if (location.pathname.includes("/viewing-interface/blogs/")) {
    return null;
  }

  return (
    <nav
      className={`z-20 flex fixed justify-between items-center h-[10vh] w-[100vw] px-4 py-12 shadow-sm border-2 transition-transform duration-300 ease-in-out transform ${
        scrolledDown ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <a className="text-2xl ml-16" href="https://lernearnburn.github.io/creater-interface/">
        Create Blogs
      </a>
      <h1 className="z-20">Blog Viewer</h1>
      <div className="flex items-center gap-8 mr-16">
        <ModeToggle />
        {props.loggedIn && (
          <a
            className="cursor-pointer w-16 text-lg whitespace-nowrap"
            onClick={logOut}
          >
            Sign Out
          </a>
        )}
        {!props.loggedIn && (
          <Link className="cursor-pointer w-16 text-lg" to="/viewing-interface/log-in">
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
