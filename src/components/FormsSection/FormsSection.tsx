import { useState } from 'react';

import Modal from '../Modal/Modal';
import ReactHookProfileForm from '../ProfileForms/ReactHookProfileForm';
import UncontrolledProfileForm from '../ProfileForms/UncontrolledProfileForm';

import './FormsSection.css';

type ActiveForm = 'uncontrolled' | 'react-hook-form';

const FORM_TITLES: Record<ActiveForm, string> = {
  uncontrolled: 'Uncontrolled form',
  'react-hook-form': 'React Hook Form',
};

export default function FormsSection() {
  const [activeForm, setActiveForm] = useState<ActiveForm | null>(null);

  const isModalOpen = activeForm !== null;

  function handleCloseModal() {
    setActiveForm(null);
  }

  function renderModalContent() {
    if (activeForm === 'uncontrolled') {
      return <UncontrolledProfileForm />;
    }

    if (activeForm === 'react-hook-form') {
      return <ReactHookProfileForm />;
    }

    return null;
  }

  return (
    <section className="forms-section" aria-labelledby="forms-title">
      <h1 id="forms-title">Forms</h1>

      <p className="forms-description">
        Open one of the form implementations in the same reusable modal.
      </p>

      <div className="forms-actions">
        <button
          className="app-button"
          type="button"
          onClick={() => setActiveForm('uncontrolled')}
        >
          Open uncontrolled form
        </button>

        <button
          className="app-button"
          type="button"
          onClick={() => setActiveForm('react-hook-form')}
        >
          Open React Hook Form
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={activeForm ? FORM_TITLES[activeForm] : 'Form'}
        onClose={handleCloseModal}
      >
        {renderModalContent()}
      </Modal>
    </section>
  );
}