type FieldErrorProps = {
  id: string;
  message?: string;
};

export default function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      className="profile-form-error-text"
      id={id}
      role={message ? 'alert' : undefined}
    >
      {message ?? '\u00A0'}
    </p>
  );
}
