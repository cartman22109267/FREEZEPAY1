// components/PhoneNumberField.js
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../utils/theme';
import typography from '../../utils/typography';

const PhoneNumberField = forwardRef(({ value, onChangeFormatted, error }, ref) => {
  const phoneInput = useRef(null);
  const { colors } = useTheme();

  useImperativeHandle(ref, () => ({
    isValidNumber: (number) => phoneInput.current?.isValidNumber(number),
  }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.innerContainer,
          { borderColor: error ? colors.error : colors.textSecondary },
        ]}
      >
        <Icon
          name="phone-outline"
          size={20}
          color={colors.textSecondary}
          style={styles.leftIcon}
        />

        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="CM"
          layout="first"
          onChangeFormattedText={onChangeFormatted}
          containerStyle={styles.phoneContainer}
          textContainerStyle={[
            styles.textContainer,
            { backgroundColor: colors.surface },
          ]}
          textInputStyle={[typography.body, { color: colors.textPrimary }]}
          codeTextStyle={[typography.body, { color: colors.textPrimary }]}
          flagButtonStyle={styles.flag}
          autoFocus={false}
          withDarkTheme={colors.isDark}
          // on retire `withShadow` pour supprimer l'ombre
        />

        {value.length > 0 && (
          <Icon
            name={error ? 'close-circle' : 'check-circle'}
            size={20}
            color={error ? colors.error : colors.success}
            style={styles.rightIcon}
          />
        )}
      </View>
      {error ? (
        <Text style={[typography.caption, { color: colors.error, marginTop: 4 }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

export default PhoneNumberField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    height: 48,
    paddingHorizontal: 8,
    position: 'relative',
  },
  leftIcon: {
    marginRight: 8,
  },
  phoneContainer: {
    flex: 1,
    borderWidth: 0,
    height: 45,
    elevation: 0,         // désactive l'ombre Android
    shadowOpacity: 0,     // désactive l'ombre iOS
  },
  textContainer: {
    paddingVertical: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  flag: {
    marginLeft: 0,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
  },
});
