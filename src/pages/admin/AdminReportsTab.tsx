import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Eye, 
  X, 
  PlusCircle, 
  Trash,
  User,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { PatientReportRecord, ReportResultItem, ServiceCategory } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminReportsTabProps {
  onShowToast: (msg: string) => void;
  onViewReport: (report: PatientReportRecord) => void;
}

const CATEGORIES: ServiceCategory[] = [
  'Hematology',
  'Biochemistry',
  'Immunology & Serology',
  'Clinical Pathology',
  'Microbiology',
  'Histopathology & Cytology'
];

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ onShowToast, onViewReport }) => {
  const { patientReports, addPatientReport, updatePatientReport, deletePatientReport } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUhid, setEditingUhid] = useState<string | null>(null);

  // Form State
  const [uhid, setUhid] = useState('');
  const [billNo, setBillNo] = useState('');
  const [barcode, setBarcode] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(38);
  const [gender, setGender] = useState('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [referredBy, setReferredBy] = useState('Dr. R. K. Sharma, MD');
  const [sampleCollectionDate, setSampleCollectionDate] = useState('18-Aug-2026 08:00 AM');
  const [reportingDate, setReportingDate] = useState('18-Aug-2026 02:00 PM');
  const [testName, setTestName] = useState('Complete Hemogram (CBC) with ESR');
  const [category, setCategory] = useState<ServiceCategory>('Hematology');
  const [sampleType, setSampleType] = useState('EDTA Whole Blood');
  const [status, setStatus] = useState<PatientReportRecord['status']>('Ready');
  const [verifiedBy, setVerifiedBy] = useState('Consultant Pathologist, MD (Path)');
  const [pathologistNotes, setPathologistNotes] = useState('Results verified with multi-level internal quality controls.');
  
  // Results rows
  const [results, setResults] = useState<ReportResultItem[]>([
    { parameter: 'Hemoglobin (Hb)', value: '14.2', unit: 'g/dL', normalRange: '13.0 - 17.0', status: 'Normal', method: 'Spectrophotometry' },
    { parameter: 'Total Leukocyte Count (TLC)', value: '6,800', unit: '/cu.mm', normalRange: '4,000 - 11,000', status: 'Normal', method: 'Flow Cytometry' },
    { parameter: 'Platelet Count', value: '2,40,000', unit: '/cu.mm', normalRange: '1,50,000 - 4,50,000', status: 'Normal', method: 'Direct Impedance' }
  ]);

  const filteredReports = patientReports.filter(r => {
    const matchesSearch = 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contactNumber.includes(searchQuery);
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingUhid(null);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setUhid(`MC-2026-${randomNum}`);
    setBillNo(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setBarcode(`BC982${randomNum}`);
    setPatientName('');
    setAge(35);
    setGender('Male');
    setContactNumber('+91 98765 43210');
    setReferredBy('Dr. Self / Consulting Physician');
    setSampleCollectionDate(`${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 08:30 AM`);
    setReportingDate(`${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 02:00 PM`);
    setTestName('Complete Blood Count (CBC)');
    setCategory('Hematology');
    setSampleType('EDTA Whole Blood');
    setStatus('Ready');
    setVerifiedBy('Consultant Pathologist, MD (Path)');
    setPathologistNotes('Sample analyzed on fully automated 6-part analyzer. Calibration checked.');
    setResults([
      { parameter: 'Hemoglobin (Hb)', value: '14.5', unit: 'g/dL', normalRange: '13.0 - 17.0', status: 'Normal', method: 'Spectrophotometry' },
      { parameter: 'Total Leukocyte Count (TLC)', value: '7,200', unit: '/cu.mm', normalRange: '4,000 - 11,000', status: 'Normal', method: 'Flow Cytometry' },
      { parameter: 'Platelet Count', value: '2,50,000', unit: '/cu.mm', normalRange: '1,50,000 - 4,50,000', status: 'Normal', method: 'Direct Impedance' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: PatientReportRecord) => {
    setEditingUhid(r.uhid);
    setUhid(r.uhid);
    setBillNo(r.billNo);
    setBarcode(r.barcode);
    setPatientName(r.patientName);
    setAge(r.age);
    setGender(r.gender);
    setContactNumber(r.contactNumber);
    setReferredBy(r.referredBy);
    setSampleCollectionDate(r.sampleCollectionDate);
    setReportingDate(r.reportingDate);
    setTestName(r.testName);
    setCategory(r.category);
    setSampleType(r.sampleType);
    setStatus(r.status);
    setVerifiedBy(r.verifiedBy);
    setPathologistNotes(r.pathologistNotes || '');
    setResults(r.results ? [...r.results] : []);
    setIsModalOpen(true);
  };

  const handleDelete = (uhidId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete patient report for "${name}" (UHID: ${uhidId})?`)) {
      deletePatientReport(uhidId);
      onShowToast(`Deleted report for ${name}`);
    }
  };

  const handleAddResultRow = () => {
    setResults(prev => [
      ...prev,
      {
        parameter: 'New Parameter',
        value: '0',
        unit: 'mg/dL',
        normalRange: '0 - 100',
        status: 'Normal',
        method: 'Automated Analyzer'
      }
    ]);
  };

  const handleUpdateResultRow = (idx: number, patch: Partial<ReportResultItem>) => {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  };

  const handleDeleteResultRow = (idx: number) => {
    setResults(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !uhid.trim()) {
      alert('Please fill in patient name and UHID.');
      return;
    }

    const payload: PatientReportRecord = {
      uhid: uhid.trim(),
      billNo: billNo.trim() || 'INV-2026-0000',
      barcode: barcode.trim() || 'BC0000000',
      patientName: patientName.trim(),
      age: Number(age) || 30,
      gender,
      contactNumber: contactNumber.trim() || '+91 98765 43210',
      referredBy: referredBy.trim() || 'Self',
      sampleCollectionDate,
      reportingDate,
      testName: testName.trim(),
      category,
      sampleType,
      status,
      verifiedBy,
      pathologistNotes: pathologistNotes.trim(),
      results: results.length > 0 ? results : [
        { parameter: 'Test Result', value: 'Negative / Normal', unit: '-', normalRange: 'Negative', status: 'Normal' }
      ]
    };

    if (editingUhid) {
      updatePatientReport(editingUhid, payload);
      onShowToast(`Updated report for ${payload.patientName}`);
    } else {
      addPatientReport(payload);
      onShowToast(`Generated new lab report for ${payload.patientName}`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Patient Reports & Pathology Portal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create verified diagnostic reports with parameter value tables, pathologist remarks, and printable PDF previews.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-indigo-300" />
          <span>Create Patient Report</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by UHID (e.g. MC-2026-90412), Barcode, Patient Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-none"
        >
          <option value="All">All Report Statuses</option>
          <option value="Ready">Ready / Verified</option>
          <option value="Processing">Processing</option>
          <option value="Sample Collected">Sample Collected</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Registered Lab Reports: <strong className="text-indigo-700">{filteredReports.length}</strong>
          </span>
          <span className="text-[11px] text-slate-400">Patients can look up reports with UHID or Mobile</span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No laboratory reports match search</h3>
            <p className="text-xs text-slate-400">Create a report or search with another patient credential.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((r) => (
              <div 
                key={r.uhid}
                className="p-4 sm:p-6 hover:bg-slate-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-950 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      UHID: {r.uhid}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{r.patientName}</span>
                    <span className="text-xs text-slate-400">({r.gender}, {r.age}y)</span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      r.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    {r.testName} <span className="text-slate-400 font-normal">({r.category})</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>Barcode: <strong className="font-mono">{r.barcode}</strong></span>
                    <span>•</span>
                    <span>Specimen: {r.sampleType}</span>
                    <span>•</span>
                    <span>Doctor: {r.referredBy}</span>
                    <span>•</span>
                    <span>{r.results ? r.results.length : 0} Parameters Recorded</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onViewReport(r)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View / Print PDF</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(r)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                    title="Edit Report"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(r.uhid, r.patientName)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Patient Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  {editingUhid ? `Edit Diagnostic Report (${uhid})` : 'Create Patient Diagnostic Report'}
                </h3>
                <p className="text-xs text-slate-500">Enter patient identifiers and configure quantitative parameter findings.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Patient Identifiers */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Demographics & Identifiers</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">UHID Number *</label>
                    <input
                      type="text"
                      required
                      value={uhid}
                      onChange={(e) => setUhid(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Barcode / Accession *</label>
                    <input
                      type="text"
                      required
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Invoice / Bill No.</label>
                    <input
                      type="text"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rameshwar Dayal"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Patient Mobile / Contact</label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Referred Doctor</label>
                    <input
                      type="text"
                      value={referredBy}
                      onChange={(e) => setReferredBy(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Investigation Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Test / Investigation Name *</label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Department Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Report Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Ready">Ready (Verified & Released)</option>
                    <option value="Processing">Processing</option>
                    <option value="Sample Collected">Sample Collected</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Parameter Results Rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">Quantitative Results & Bio-Reference Intervals ({results.length})</label>
                  <button
                    type="button"
                    onClick={handleAddResultRow}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Parameter Row</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <div className="bg-slate-100 p-2.5 grid grid-cols-12 gap-2 font-bold text-slate-700 text-[11px]">
                    <span className="col-span-4">Parameter Name</span>
                    <span className="col-span-2">Observed Value</span>
                    <span className="col-span-2">Unit</span>
                    <span className="col-span-2">Biological Range</span>
                    <span className="col-span-1 text-center">Status</span>
                    <span className="col-span-1 text-center">Action</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {results.map((row, idx) => (
                      <div key={idx} className="p-2 grid grid-cols-12 gap-2 items-center hover:bg-slate-50">
                        <input
                          type="text"
                          value={row.parameter}
                          onChange={(e) => handleUpdateResultRow(idx, { parameter: e.target.value })}
                          className="col-span-4 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleUpdateResultRow(idx, { value: e.target.value })}
                          className="col-span-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleUpdateResultRow(idx, { unit: e.target.value })}
                          className="col-span-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={row.normalRange}
                          onChange={(e) => handleUpdateResultRow(idx, { normalRange: e.target.value })}
                          className="col-span-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-500"
                        />
                        <select
                          value={row.status}
                          onChange={(e) => handleUpdateResultRow(idx, { status: e.target.value as any })}
                          className={`col-span-1 px-1 py-1 rounded-lg text-[10px] font-bold border text-center ${
                            row.status === 'Normal' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Low">Low</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteResultRow(idx)}
                          className="col-span-1 text-rose-500 hover:text-rose-700 flex justify-center"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Pathologist Comments & Clinical Interpretation</label>
                <textarea
                  rows={2}
                  value={pathologistNotes}
                  onChange={(e) => setPathologistNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="Enter remarks, microscopic smear impressions, or critical value correlation notes..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingUhid ? 'Save Report Updates' : 'Publish Report'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
