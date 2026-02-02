import { useTheme } from "@/src/hooks";
import { BorderRadius, Spacing } from "@/src/theme";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
}

export function CustomAlert({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: CustomAlertProps) {
  const { colors } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonColor = (style?: string) => {
    switch (style) {
      case 'destructive':
        return '#ef4444'; // Rojo
      case 'cancel':
        return colors.textSecondary; // Gris
      default:
        return colors.primary; // Azul/Primary
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.alertContainer} onStartShouldSetResponder={() => true}>
          <View style={[styles.alert, { backgroundColor: colors.card }]}>
            {/* Título */}
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>

            {/* Mensaje (opcional) */}
            {message && (
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {message}
              </Text>
            )}

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleButtonPress(button)}
                  style={[
                    styles.button,
                    buttons.length === 1 && styles.singleButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: getButtonColor(button.style) },
                      button.style === 'cancel' && styles.cancelText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    maxWidth: 400,
  },
  alert: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  singleButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    fontWeight: '400',
  },
});