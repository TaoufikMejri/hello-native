import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearToken } from '../authStorage';
import { colors } from '../theme';

export default function Welcome() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  async function handleLogOut() {
    await clearToken();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{name ? `, ${name}` : ''}!</Text>
      <Text style={styles.subtitle}>You&apos;re signed in.</Text>

      <Pressable style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
  },
  logoutButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
