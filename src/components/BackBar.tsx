import { motion } from "framer-motion";
import { ArrowLeftFromLine } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Share } from "lucide-react";

const animations = {
  initial: { opacity: 0, x: -120 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -120 },
};

interface BtnBarProps {
  backFunc: () => void;
  toCommentsFunc: () => void;
}

export const BtnBar = ({ backFunc, toCommentsFunc }: BtnBarProps) => {
  return (
    <motion.div
      className="absolute top-0 left-[-5.3vw] flex flex-col gap-1 whitespace-nowrap w-fit"
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button
        className="w-16 h-16 btn-bar hover:scale-[1.01] flex items-center justify-center"
        onClick={backFunc}
      >
        <ArrowLeftFromLine className="icon" />
      </button>
      <button
        className="w-16 h-16 btn-bar hover:scale-[1.01] flex items-center justify-center"
        onClick={toCommentsFunc}
      >
        <MessageCircle className="icon" />
      </button>
      <button className="w-16 h-16 btn-bar hover:scale-[1.01] flex items-center justify-center">
        <Share className="icon" />
      </button>
    </motion.div>
  );
};
