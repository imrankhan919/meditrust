import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const field = (value) => (value === undefined || value === null || value === "" ? "Not provided" : String(value));

export default function VerificationModal({
  isOpen,
  onClose,
  item,
  type = 'Doctor',
  isPending = false,
  mutationError = null,
  onApprove,
  onReject
}) {
  if (!item) return null;

  const isDoctor = type === 'Doctor';
  const displayName = isDoctor
    ? item.clinicName || item.name
    : item.laboratoryName || item.name;
  const specialty = item.specialization || item.type;
  const address = isDoctor ? item.address : item.laboratoryAddress;
  const license = item.registrationNumber || item.license;
  const contactEmail = item.email || item.user?.email;
  const contactPhone = item.phone || item.user?.phone;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verify ${type} Credentials`}
      subtitle={`Review registration details for ${field(displayName)}`}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button
            variant="danger"
            size="sm"
            onClick={onReject || onClose}
            icon={XCircle}
            disabled={isPending}
          >
            {isPending ? "Working..." : item.isVerified ? "Revoke Verification" : "Reject Application"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onApprove || onClose}
            icon={CheckCircle2}
            disabled={isPending}
          >
            {isPending ? "Working..." : item.isVerified ? "Confirm Verified" : "Approve & Verify"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-900 text-sm">{field(displayName)}</span>
            <Badge variant={item.isVerified ? "success" : "warning"} size="sm">
              {item.isVerified ? "Verified" : "Verification Pending"}
            </Badge>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
            <div>
              <dt className="text-slate-400 block">Registration Number</dt>
              <dd className="font-mono font-bold text-slate-800">{field(license)}</dd>
            </div>
            <div>
              <dt className="text-slate-400 block">Specialty / Field</dt>
              <dd className="font-semibold text-slate-800">{field(specialty)}</dd>
            </div>
            <div>
              <dt className="text-slate-400 block">{isDoctor ? "Clinic Address" : "Laboratory Address"}</dt>
              <dd className="font-semibold text-slate-800">{field(address)}</dd>
            </div>
            <div>
              <dt className="text-slate-400 block">Qualification</dt>
              <dd className="font-semibold text-slate-800">{field(item.qualification)}</dd>
            </div>
            <div>
              <dt className="text-slate-400 block">Experience</dt>
              <dd className="font-semibold text-slate-800">{field(item.experience)}</dd>
            </div>
            <div>
              <dt className="text-slate-400 block">Contact</dt>
              <dd className="font-semibold text-slate-800">{field(contactEmail)}{contactPhone && contactPhone !== contactEmail ? ` · ${contactPhone}` : ""}</dd>
            </div>
          </dl>
        </div>

        {mutationError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {mutationError}
          </div>
        )}

        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
          <span>
            Approving calls the real admin verification endpoint and promotes the linked
            user account. Rejecting revokes verification. Changes refresh automatically on success.
          </span>
        </div>
      </div>
    </Modal>
  );
}
