import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode,
  User,
  Calendar,
  Lock
} from 'lucide-react';
import { PatientReportRecord, PageType } from '../types';
import { LAB_INFO } from '../data/labData';
import { useData } from '../context/DataContext';

interface PatientReportsViewProps {
  onViewReport: (report: PatientReportRecord) => void;
  onNavigate: (page: PageType) => void;
}

export const PatientReportsView: React.FC<PatientReportsViewProps> = ({
  onViewReport,
  onNavigate
}) => {
  const { patientReports } = useData();
  const [searchInput, setSearchInput] = useState('');
  const [searchedRecords, setSearchedRecords] = useState<PatientReportRecord[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      const q = searchInput.trim().toLowerCase();
      const results = patientReports.filter(r => 
        r.uhid.toLowerCase().includes(q) ||
        r.contactNumber.includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.barcode.toLowerCase().includes(q)
      );
      setSearchedRecords(results);
      setIsSearching(false);
    }, 300);
  };

  const handleLoadDemo = (record: PatientReportRecord) => {
    setSearchInput(record.uhid);
    setSearchedRecords([record]);
    setHasSearched(true);
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Patient Portal Access
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Download Your Diagnostic Reports
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Enter your unique Patient ID (UHID) or registered mobile number to securely view, print, and download your verified digital pathology reports.
            </p>
          </div>
        </div>
      </section>

      {/* Search Input Box */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Secure Patient Report Verification
              </h2>
              <p className="text-xs text-slate-500">
                Enter credentials printed on your lab payment receipt or SMS notification.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Patient UHID, Accession Barcode, or Registered Mobile <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. MC-2026-90412 or 9876543210"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-900 to-teal-800 hover:from-blue-800 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <span>Retrieving Verified Records from Lab LIMS...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-teal-300" />
                  <span>Search & View Report</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Demonstration / Sample UHIDs (Click to Test):
            </span>
            <div className="flex flex-wrap gap-2">
              {patientReports.slice(0, 4).map((sample) => (
                <button
                  key={sample.uhid}
                  type="button"
                  onClick={() => handleLoadDemo(sample)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-slate-700 text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                  <span>{sample.uhid} ({sample.testName.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Display */}
      {hasSearched && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Laboratory Search Results ({searchedRecords ? searchedRecords.length : 0} Record Found)
            </h3>

            {searchedRecords && searchedRecords.length > 0 ? (
              <div className="space-y-4">
                {searchedRecords.map((report) => (
                  <div
                    key={report.uhid}
                    className="bg-white rounded-3xl border-2 border-teal-500/30 p-6 shadow-md hover:shadow-lg transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{report.status}</span>
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-bold">
                            UHID: {report.uhid}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mt-1">
                          {report.patientName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {report.age} Y / {report.gender} • Ref By: {report.referredBy}
                        </p>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Test Investigation</span>
                        <span className="text-xs font-bold text-blue-900">{report.testName}</span>
                        <span className="text-[11px] text-slate-500 block font-mono">Barcode: {report.barcode}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Collection</span>
                        <span className="font-medium text-slate-800">{report.sampleCollectionDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Reporting</span>
                        <span className="font-medium text-slate-800">{report.reportingDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Specimen</span>
                        <span className="font-medium text-slate-800">{report.sampleType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Verified By</span>
                        <span className="font-medium text-slate-800">{report.verifiedBy}</span>
                      </div>
                    </div>

                    {/* Result Parameters summary */}
                    <div className="text-xs space-y-1.5">
                      <span className="font-bold text-slate-800 block">Report Parameters Summary:</span>
                      <div className="flex flex-wrap gap-2">
                        {report.results.map((res, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                            <strong>{res.parameter}:</strong> {res.value} {res.unit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Signed by Consultant Pathologist</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewReport(report)}
                          className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4 text-teal-300" />
                          <span>View Official Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No report matching "{searchInput}" found.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Please verify your UHID number on your payment receipt or contact our lab desk if your sample was recently collected.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Security & Confidentiality Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Digital Patient Data Privacy & Encryption</span>
          </div>
          <p className="leading-relaxed">
            Patient health information is handled with strict medical confidentiality. Digital reports are watermarked, cryptographically signed, and tamper-evident. If you need historical reports prior to 2026, please visit our central lab or email our medical records division.
          </p>
        </div>
      </section>

    </div>
  );
};
