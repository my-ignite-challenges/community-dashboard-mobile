import React from "react";

import { View, Text } from "react-native";
import { MotiView } from "moti";

import { Avatar } from "../Avatar/ index";

import { styles } from "./styles";

export type MessageProps = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

type Props = {
  message: MessageProps;
};

export function Message({ message }: Props) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 700 }}
      style={styles.container}
    >
      <Text style={styles.message}>{message.text}</Text>
      <View style={styles.author}>
        <Avatar avatar_uri={message.user.avatar_url} size="SMALL" />
        <Text style={styles.authorName}>{message.user.name}</Text>
      </View>
    </MotiView>
  );
}
