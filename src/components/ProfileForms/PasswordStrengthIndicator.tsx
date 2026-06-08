import { getPasswordStrength } from '../../utils/passwordStrength';

type PasswordStrengthIndicatorProps = {
  password: string;
};

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password);

  const strengthItems = [
    {
      label: '1 number',
      isValid: strength.hasNumber,
    },
    {
      label: '1 uppercase letter',
      isValid: strength.hasUppercase,
    },
    {
      label: '1 lowercase letter',
      isValid: strength.hasLowercase,
    },
    {
      label: '1 special character',
      isValid: strength.hasSpecialCharacter,
    },
  ];

  return (
    <div className="password-strength" aria-live="polite">
      <span>Password strength</span>

      <ul>
        {strengthItems.map((item) => (
          <li
            className={item.isValid ? 'password-strength-item--valid' : ''}
            key={item.label}
          >
            {item.isValid ? '✓' : '×'} {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
