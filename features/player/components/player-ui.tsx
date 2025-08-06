import { usePlayerContext } from "@/context/player-context";
import { memo } from "react";
import MiniPlayer from "./mini-player";
import FullScreenPlayer from "./full-screen-player";

function PlayerUIComponent() {
  const {
    animatedImageStyle,
    animatedFullPlayerStyle,
    animatedMiniPlayerStyle,
    onExpand,
    onCollapse,
  } = usePlayerContext();

  return (
    <>
      <MiniPlayer
        animatedMiniPlayerStyle={animatedMiniPlayerStyle}
        onExpand={onExpand}
        animatedImageStyle={animatedImageStyle}
      />
      <FullScreenPlayer
        animatedFullPlayerStyle={animatedFullPlayerStyle}
        onCollapse={onCollapse}
        animatedImageStyle={animatedImageStyle}
      />
    </>
  );
}

export const PlayerUI = memo(PlayerUIComponent);
