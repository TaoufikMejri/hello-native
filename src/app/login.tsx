import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ApiError, login } from '../api';
import { saveToken } from '../authStorage';
import { FormField } from '../components/FormField';
import { colors } from '../theme';
import { isValidEmail } from '../validation';

type Errors = Partial<Record<'email' | 'password' | 'form', string>>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors: Errors = {};
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address';
    if (!password) nextErrors.password = 'Enter your password';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { token, user } = await login({ email: email.trim(), password });
      await saveToken(token);
      router.replace({ pathname: '/welcome', params: { name: user.name } });
    } catch (error) {
      const message = error instanceof ApiError ? error.errors.join(', ') : 'Something went wrong. Check your connection.';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Welcome back</Text>

      <FormField
        label="Email"
        placeholder="jane@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />
      <FormField
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

      {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

      <Pressable
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.primaryText} />
        ) : (
          <Text style={styles.submitButtonText}>Log In</Text>
        )}
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Need an account?</Text>
        <Link href="/sign-up">
          <Text style={styles.footerLink}>Sign up</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  formError: {
    color: colors.error,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    color: colors.muted,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
