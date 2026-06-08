import { useEffect } from 'react';

import {
  clearNewestSubmissionHighlight,
  selectFormSubmissions,
  selectNewestSubmissionId,
} from '../../features/formSubmissions/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import './FormSubmissionsList.css';

function formatSubmittedAt(submittedAt: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(submittedAt));
}

export default function FormSubmissionsList() {
  const dispatch = useAppDispatch();
  const submissions = useAppSelector(selectFormSubmissions);
  const newestSubmissionId = useAppSelector(selectNewestSubmissionId);

  useEffect(() => {
    if (!newestSubmissionId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearNewestSubmissionHighlight());
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, newestSubmissionId]);

  return (
    <section
      className="form-submissions-section"
      aria-labelledby="submissions-title"
    >
      <h1 id="submissions-title">Submitted profiles</h1>

      {submissions.length === 0 ? (
        <p className="form-submissions-empty">
          No submitted profiles yet. Open one of the forms and submit valid data
          to see it here.
        </p>
      ) : (
        <div className="form-submissions-grid">
          {submissions.map((submission) => {
            const isNewestSubmission = submission.id === newestSubmissionId;

            return (
              <article
                className={`submission-card ${
                  isNewestSubmission ? 'submission-card--new' : ''
                }`}
                key={submission.id}
              >
                <div className="submission-card-header">
                  <div>
                    <h2>{submission.name}</h2>
                    <p>{submission.formType}</p>
                  </div>

                  <span className="submission-card-date">
                    {formatSubmittedAt(submission.submittedAt)}
                  </span>
                </div>

                <div className="submission-card-body">
                  {submission.imageBase64 && (
                    <img
                      className="submission-card-image"
                      src={submission.imageBase64}
                      alt={`${submission.name}'s uploaded profile`}
                    />
                  )}

                  <dl className="submission-card-details">
                    <div>
                      <dt>Age</dt>
                      <dd>{submission.age}</dd>
                    </div>

                    <div>
                      <dt>Email</dt>
                      <dd>{submission.email}</dd>
                    </div>

                    <div>
                      <dt>Gender</dt>
                      <dd>{submission.gender}</dd>
                    </div>

                    <div>
                      <dt>Country</dt>
                      <dd>{submission.country}</dd>
                    </div>

                    <div>
                      <dt>Terms accepted</dt>
                      <dd>{submission.termsAccepted ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="password-strength-summary">
                  <span>Password contains:</span>

                  <ul>
                    <li>
                      {submission.passwordStrength.hasNumber ? '✓' : '×'} number
                    </li>
                    <li>
                      {submission.passwordStrength.hasUppercase ? '✓' : '×'}{' '}
                      uppercase
                    </li>
                    <li>
                      {submission.passwordStrength.hasLowercase ? '✓' : '×'}{' '}
                      lowercase
                    </li>
                    <li>
                      {submission.passwordStrength.hasSpecialCharacter
                        ? '✓'
                        : '×'}{' '}
                      special character
                    </li>
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
