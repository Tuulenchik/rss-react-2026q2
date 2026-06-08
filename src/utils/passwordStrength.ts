import type { PasswordStrength } from '../types/formSubmission';

function isNumber(character: string) {
  return character >= '0' && character <= '9';
}

function isUppercaseLetter(character: string) {
  return character >= 'A' && character <= 'Z';
}

function isLowercaseLetter(character: string) {
  return character >= 'a' && character <= 'z';
}

function isSpecialCharacter(character: string) {
  return (
    character.trim() !== '' &&
    !isNumber(character) &&
    !isUppercaseLetter(character) &&
    !isLowercaseLetter(character)
  );
}

export function getPasswordStrength(password: string): PasswordStrength {
  const characters = Array.from(password);

  return {
    hasNumber: characters.some(isNumber),
    hasUppercase: characters.some(isUppercaseLetter),
    hasLowercase: characters.some(isLowercaseLetter),
    hasSpecialCharacter: characters.some(isSpecialCharacter),
  };
}
