import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Building,
  User,
  Calendar,
  Phone
} from 'lucide-react';
import { PatientReportRecord } from '../types';
import { LAB_INFO } from '../data/labData';

interface ReportViewerModalProps {
  report: PatientReportRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Generate simulated download
    const element = document.createElement('a');
    const file = new Blob([
      `MICROCELLS DIAGNOSTICS PVT. LTD. - OFFICIAL DIAGNOSTIC REPORT\n` +
      `UHID: ${report.uhid} | Barcode: ${report.barcode}\n` +
      `Patient Name: ${report.patientName} (${report.age} Y / ${report.gender})\n` +
      `Investigation: ${report.testName}\n` +
      `Sample Collected: ${report.sampleCollectionDate}\n` +
      `Reporting Date: ${report.reportingDate}\n\n` +
      `RESULTS:\n` +
      report.results.map(r => `${r.parameter}: ${r.value} ${r.unit} [Ref: ${r.normalRange}] - ${r.status}`).join('\n') +
      `\n\nVerified by: ${report.verifiedBy}\n` +
      `Notes: ${report.pathologistNotes || 'N/A'}`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.uhid}_${report.testName.replace(/[^a-zA-Z0-9]/g, '_')}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-300 relative my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Controls Header (no-print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                Digital Laboratory Report Preview
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                UHID: {report.uhid} | {report.testName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Print Official Report"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Report Document Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-slate-900 font-sans">
          
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-blue-950 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-950 flex items-center justify-center text-white shrink-0">
                  <svg className="w-7 h-7 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
                    <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" stroke="#ffffff" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-tight font-display">
                    MICROCELLS DIAGNOSTICS PVT. LTD.
                  </h1>
                  <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                    Advanced Pathology & Clinical Reference Laboratory
                  </p>
                  <p className="text-[10px] text-slate-500 max-w-md">
                    {LAB_INFO.address} | Helpline: {LAB_INFO.phone}
                  </p>
                </div>
              </div>

              {/* Barcode & Security Badge */}
              <div className="text-right flex flex-col items-end shrink-0">
                <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Sample Barcode</span>
                  <span className="text-xs font-bold text-slate-800">||| | || |||| | | {report.barcode}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Electronically Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Patient Demographics Table */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 mb-6 text-xs text-slate-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name:</span>
                <strong className="text-slate-900 text-sm font-bold">{report.patientName}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Gender:</span>
                <span className="font-semibold">{report.age} Y / {report.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">UHID / Patient ID:</span>
                <span className="font-mono font-bold text-blue-900">{report.uhid}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Bill / Accession No:</span>
                <span className="font-mono font-semibold">{report.billNo}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Referred By:</span>
                <span className="font-medium text-slate-800">{report.referredBy}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Specimen / Sample:</span>
                <span className="font-medium">{report.sampleType}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Collection Time:</span>
                <span>{report.sampleCollectionDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Reporting Time:</span>
                <span className="font-semibold text-slate-900">{report.reportingDate}</span>
              </div>
            </div>
          </div>

          {/* Department & Test Title Banner */}
          <div className="bg-blue-950 text-white px-4 py-2 rounded-xl mb-4 flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider">
              Department of {report.category}
            </span>
            <span className="text-xs font-semibold text-teal-300">
              Investigation: {report.testName}
            </span>
          </div>

          {/* Test Results Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Investigation / Parameter</th>
                  <th className="py-2.5 px-3">Observed Value</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Biological Reference Interval</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.results.map((res, index) => {
                  const isAbnormal = res.status === 'High' || res.status === 'Low';
                  return (
                    <tr key={index} className={isAbnormal ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {res.parameter}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`font-mono text-sm font-extrabold ${
                          isAbnormal ? 'text-rose-600 font-black' : 'text-slate-900'
                        }`}>
                          {res.value} {res.flag && `(${res.flag})`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-medium">
                        {res.unit || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {res.normalRange}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'Normal' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : res.status === 'High' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400 text-[11px] hidden sm:table-cell">
                        {res.method || 'Standard Automated'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pathologist Notes & Interpretation */}
          {report.pathologistNotes && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">
                Clinical Pathology Comments / Interpretation:
              </span>
              <p className="leading-relaxed text-slate-600">
                {report.pathologistNotes}
              </p>
            </div>
          )}

          {/* End of Report Sign-off */}
          <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            <div className="space-y-1 text-center sm:text-left text-slate-500 text-[11px]">
              <p>*** END OF DIAGNOSTIC REPORT ***</p>
              <p>This report has been reviewed, cross-calibrated and authorized electronically.</p>
              <p>For any queries, please quote UHID: <strong>{report.uhid}</strong> to our laboratory helpline.</p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="font-serif italic font-bold text-blue-950 text-base mb-0.5">
                Microcells Pathology Group
              </div>
              <div className="font-bold text-slate-800">{report.verifiedBy}</div>
              <div className="text-[10px] text-slate-400 uppercase">Consultant Pathologist & Lab Director</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
