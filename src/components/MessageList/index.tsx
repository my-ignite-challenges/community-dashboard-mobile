import React, { useEffect, useState } from "react";

import { ScrollView } from "react-native";
import { api } from "../../services/api";
import { io } from "socket.io-client";

import { MESSAGES_EXAMPLE } from "../../utils/messages";

import { Message, MessageProps } from "../Message";

import { styles } from "./styles";

let messageQueue: MessageProps[] = MESSAGES_EXAMPLE;

const socket = io(String(api.defaults.baseURL));
socket.on("new_message", (newMessage) => {
  messageQueue.push(newMessage);
});

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setCurrentMessages((previousState) =>
          [messageQueue[0], previousState[0], previousState[1]].filter(Boolean)
        );

        messageQueue.shift();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const messagesReponse = await api.get<MessageProps[]>(
        "/messages/last-three"
      );

      setCurrentMessages(messagesReponse.data);
    }
    fetchMessages();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </ScrollView>
  );
}
