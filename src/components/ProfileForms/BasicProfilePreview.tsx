import type { BasicProfileFormValues } from '../../types/profileForm';

type BasicProfilePreviewProps = {
  data: BasicProfileFormValues | null;
};

export default function BasicProfilePreview({
  data,
}: BasicProfilePreviewProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="profile-form-preview" aria-live="polite">
      <h3>Collected basic data</h3>

      <dl>
        <div>
          <dt>Name</dt>
          <dd>{data.name || 'Not provided'}</dd>
        </div>

        <div>
          <dt>Age</dt>
          <dd>{data.age || 'Not provided'}</dd>
        </div>

        <div>
          <dt>Email</dt>
          <dd>{data.email || 'Not provided'}</dd>
        </div>

        <div>
          <dt>Gender</dt>
          <dd>{data.gender || 'Not selected'}</dd>
        </div>

        <div>
          <dt>Terms accepted</dt>
          <dd>{data.termsAccepted ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </div>
  );
}
