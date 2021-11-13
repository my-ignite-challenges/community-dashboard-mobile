import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./styles";

import LogoSvg from "../../assets/logo.svg";
import { Avatar } from "../Avatar/ index";
import { useAuth } from "../../hooks/auth";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <LogoSvg />

      <View style={styles.profile}>
        {user && (
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        )}
        <Avatar avatar_uri={user?.avatar_url} />
      </View>
    </View>
  );
}
