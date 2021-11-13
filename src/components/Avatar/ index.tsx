import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image } from "react-native";

import avatarDefaultImg from "../../assets/avatar.png";
import { COLORS } from "../../theme";

import { styles } from "./styles";

type Props = {
  avatar_uri: string | undefined;
  size?: "SMALL" | "NORMAL";
};

const SIZES = {
  SMALL: {
    gradientContainerSize: 32,
    imageSize: 28,
  },
  NORMAL: {
    gradientContainerSize: 48,
    imageSize: 42,
  },
};

const DEFAULT_AVATAR = Image.resolveAssetSource(avatarDefaultImg).uri;

export function Avatar({ avatar_uri, size = "NORMAL" }: Props) {
  const { gradientContainerSize, imageSize } = SIZES[size];

  return (
    <LinearGradient
      colors={[COLORS.PINK, COLORS.YELLOW]}
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.container,
        {
          width: gradientContainerSize,
          height: gradientContainerSize,
          borderRadius: gradientContainerSize / 2,
        },
      ]}
    >
      <Image
        source={{ uri: avatar_uri || DEFAULT_AVATAR }}
        style={[
          styles.avatar,
          {
            width: imageSize,
            height: imageSize,
            borderRadius: imageSize / 2,
          },
        ]}
      />
    </LinearGradient>
  );
}
