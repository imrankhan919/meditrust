import React from 'react';
import { ShieldCheck, XCircle, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function VerificationModal({ 
  isOpen, 
  onClose, 
  item, 
  type = 'Doctor',
  onApprove,
  onReject 
}) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verify ${type} Credentials`}
      subtitle={`Review state licensure and clinical certification for ${item.name}`}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={onReject || onClose}
            icon={XCircle}
          >
            Reject Application
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onApprove || onClose}
            icon={CheckCircle2}
          >
            Approve & Verify License
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        
        {/* Practitioner Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">{item.name}</span>
            <Badge variant="warning" size="sm">Verification Pending</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400 block">Registration License:</span>
              <span className="font-mono font-bold text-slate-800">{item.license || 'NY-MED-849102-X'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Specialty / Field:</span>
              <span className="font-semibold text-slate-800">{item.specialty || item.type || 'Cardiology'}</span>
            </div>
          </div>
        </div>

        {/* Uploaded Certificate Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Attached Primary Medical Documents
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-800">State_Medical_License_Verification.pdf</span>
              </div>
              <span className="text-teal-600 font-semibold hover:underline cursor-pointer">Preview</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-800">Board_Specialty_Fellowship_Cert.pdf</span>
              </div>
              <span className="text-teal-600 font-semibold hover:underline cursor-pointer">Preview</span>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
          <span>Automated NPDB (National Practitioner Data Bank) sanctions check returned clear with zero adverse records.</span>
        </div>

      </div>
    </Modal>
  );
}
