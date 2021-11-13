import React, { useState } from "react";

import { View, TextInput, Alert, Keyboard } from "react-native";
import { api } from "../../services/api";
import { COLORS } from "../../theme";
import { Button } from "../Button";

import { styles } from "./styles";

export function SendMessageForm() {
  const [message, setMessage] = useState("");
  const [messageIsBeingSent, setMessageIsBeingSent] = useState(false);

  async function handleMessageSubmit() {
    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 0) {
      setMessageIsBeingSent(true);
      await api.post("/messages", { message: trimmedMessage });

      setMessage("");
      Keyboard.dismiss();
      setMessageIsBeingSent(false);
      Alert.alert("Mensagem enviada com sucesso!");
    } else {
      Alert.alert("Digite a mensagem para enviar");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardAppearance="dark"
        placeholder="Qual é sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        editable={!messageIsBeingSent}
      />

      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        isLoading={messageIsBeingSent}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}
