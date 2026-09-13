import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AgrometAdvisory, AdvisoryApprovalStatus } from '../types/advisory';
import type { FarmerObservation, ObservationVerificationStatus } from '../types/observation';
import type { WeatherAlert } from '../types/alert';
import type { FeedbackSubmission, AuditLogEntry } from '../types/common';
import type { AdvisoryRule, RuleApprovalStatus } from '../types/knowledgeBase';
import { INITIAL_ADVISORIES } from '../data/mockAdvisories';
import { INITIAL_OBSERVATIONS } from '../data/mockObservations';
import { INITIAL_ALERTS } from '../data/mockAlerts';
import { INITIAL_MOCK_ADVISORY_RULES } from '../data/mockAdvisoryRules';
import { isBackendApiEnabled } from '../config/api';
import { backendApi } from '../services/backendApi';

interface MockDataContextType {
  advisories: AgrometAdvisory[];
  observations: FarmerObservation[];
  alerts: WeatherAlert[];
  feedbacks: FeedbackSubmission[];
  auditLogs: AuditLogEntry[];
  advisoryRules: AdvisoryRule[];
  addObservation: (obs: Omit<FarmerObservation, 'id' | 'submittedAt' | 'status'>) => void;
  updateObservationStatus: (
    id: string,
    status: ObservationVerificationStatus,
    reviewerName: string,
    notesEn?: string,
    notesHi?: string
  ) => void;
  updateAdvisoryStatus: (
    id: string,
    status: AdvisoryApprovalStatus,
    officerName: string
  ) => void;
  createAdvisory: (advisory: Omit<AgrometAdvisory, 'id' | 'createdAt' | 'helpfulCount' | 'unhelpfulCount'>) => void;
  broadcastAlert: (alert: Omit<WeatherAlert, 'id' | 'issuedAt' | 'isActive'>) => void;
  toggleAlertActive: (id: string) => void;
  submitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'submittedAt'>) => void;
  voteAdvisoryHelpful: (id: string, isHelpful: boolean) => void;
  voteAdvisoryFeedback: (id: string, isHelpful: boolean) => void;
  // Knowledge Base Advisory Rules operations
  createRule: (rule: Omit<AdvisoryRule, 'id' | 'createdAt' | 'versionHistory' | 'version'> & { initialVersion?: string }) => void;
  updateRule: (id: string, updated: Partial<AdvisoryRule>, changeSummary: string, modifierName: string) => void;
  reviewRule: (id: string, status: RuleApprovalStatus, reviewerName: string, reviewNotes?: string) => void;
  publishRule: (id: string, publisherName: string, notes?: string) => void;
  rejectRule: (id: string, reviewerName: string, reason: string) => void;
  deleteRule: (id: string, deleterName: string) => void;
  resetRulesToDefault: () => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const ADVISORIES_STORAGE_KEY = 'panchayatmausam_advisories_v1';
const OBSERVATIONS_STORAGE_KEY = 'panchayatmausam_observations_v1';
const ALERTS_STORAGE_KEY = 'panchayatmausam_alerts_v1';
const FEEDBACKS_STORAGE_KEY = 'panchayatmausam_feedbacks_v1';
const AUDIT_STORAGE_KEY = 'panchayatmausam_audit_v1';
const RULES_STORAGE_KEY = 'panchayatmausam_advisory_rules_v1';

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [advisories, setAdvisories] = useState<AgrometAdvisory[]>(() => {
    try {
      const saved = localStorage.getItem(ADVISORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ADVISORIES;
    } catch {
      return INITIAL_ADVISORIES;
    }
  });

  const [observations, setObservations] = useState<FarmerObservation[]>(() => {
    try {
      const saved = localStorage.getItem(OBSERVATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_OBSERVATIONS;
    } catch {
      return INITIAL_OBSERVATIONS;
    }
  });

  const [alerts, setAlerts] = useState<WeatherAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(FEEDBACKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [advisoryRules, setAdvisoryRules] = useState<AdvisoryRule[]>(() => {
    try {
      const saved = localStorage.getItem(RULES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MOCK_ADVISORY_RULES;
    } catch {
      return INITIAL_MOCK_ADVISORY_RULES;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'log-001',
              timestamp: '2026-09-12T09:30:00+05:30',
              userId: 'usr-aeo-01',
              userName: 'Dr. R. K. Sharma',
              userRole: 'officer',
              action: 'APPROVED_ADVISORY',
              targetEntity: 'AgrometAdvisory',
              targetId: 'adv-001',
              details: 'Approved Semilooper surveillance advisory for Acharpura GP.',
              status: 'success',
            },
            {
              id: 'log-002',
              timestamp: '2026-09-12T11:00:00+05:30',
              userId: 'usr-admin-01',
              userName: 'State Agromet Administrator',
              userRole: 'admin',
              action: 'DISPATCH_ALERT',
              targetEntity: 'WeatherAlert',
              targetId: 'alt-001',
              details: 'Broadcasted Orange Warning for Tuesday Thunderstorm across Phanda Block.',
              status: 'success',
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(advisoryRules));
    } catch {
      // ignore
    }
  }, [advisoryRules]);

  useEffect(() => {
    try {
      localStorage.setItem(ADVISORIES_STORAGE_KEY, JSON.stringify(advisories));
    } catch {
      // ignore
    }
  }, [advisories]);

  useEffect(() => {
    try {
      localStorage.setItem(OBSERVATIONS_STORAGE_KEY, JSON.stringify(observations));
    } catch {
      // ignore
    }
  }, [observations]);

  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(feedbacks));
    } catch {
      // ignore
    }
  }, [feedbacks]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  // Synchronize with live FastAPI backend if enabled
  useEffect(() => {
    if (!isBackendApiEnabled()) return;

    const syncWithBackend = async () => {
      try {
        const [backendAdvisories, backendRules, backendObs, backendAlerts, backendLogs] = await Promise.allSettled([
          backendApi.getAdvisories(),
          backendApi.getRules(),
          backendApi.getObservations(),
          backendApi.getAlerts(),
          backendApi.getAuditLogs(),
        ]);

        if (backendAdvisories.status === 'fulfilled' && Array.isArray(backendAdvisories.value) && backendAdvisories.value.length > 0) {
          setAdvisories(backendAdvisories.value);
        }
        if (backendRules.status === 'fulfilled' && Array.isArray(backendRules.value) && backendRules.value.length > 0) {
          setAdvisoryRules(backendRules.value);
        }
        if (backendObs.status === 'fulfilled' && Array.isArray(backendObs.value) && backendObs.value.length > 0) {
          setObservations(backendObs.value);
        }
        if (backendAlerts.status === 'fulfilled' && Array.isArray(backendAlerts.value) && backendAlerts.value.length > 0) {
          setAlerts(backendAlerts.value);
        }
        if (backendLogs.status === 'fulfilled' && Array.isArray(backendLogs.value) && backendLogs.value.length > 0) {
          setAuditLogs(backendLogs.value);
        }
      } catch {
        // Silently preserve current state on backend sync failure
      }
    };

    syncWithBackend();
  }, []);

  const addObservation = (obs: Omit<FarmerObservation, 'id' | 'submittedAt' | 'status'>) => {
    const newObs: FarmerObservation = {
      ...obs,
      id: `obs-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setObservations((prev) => [newObs, ...prev]);

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-farmer-anon',
      userName: obs.farmerName || 'Local Farmer',
      userRole: 'farmer',
      action: 'SUBMITTED_FIELD_OBSERVATION',
      targetEntity: 'FarmerObservation',
      targetId: newObs.id,
      details: `Field report submitted from ${obs.villageNameEn}, GP ${obs.panchayatNameEn}`,
      status: 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const updateObservationStatus = (
    id: string,
    status: ObservationVerificationStatus,
    reviewerName: string,
    notesEn?: string,
    notesHi?: string
  ) => {
    setObservations((prev) =>
      prev.map((obs) => {
        if (obs.id === id) {
          return {
            ...obs,
            status,
            reviewedBy: reviewerName,
            reviewNotesEn: notesEn || obs.reviewNotesEn,
            reviewNotesHi: notesHi || obs.reviewNotesHi,
            reviewedAt: new Date().toISOString(),
          };
        }
        return obs;
      })
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-officer-01',
      userName: reviewerName,
      userRole: 'officer',
      action: `OBSERVATION_${status.toUpperCase()}`,
      targetEntity: 'FarmerObservation',
      targetId: id,
      details: `Observation ${id} marked as ${status}`,
      status: 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const updateAdvisoryStatus = (
    id: string,
    status: AdvisoryApprovalStatus,
    officerName: string
  ) => {
    setAdvisories((prev) =>
      prev.map((adv) => {
        if (adv.id === id) {
          return {
            ...adv,
            approvalStatus: status,
            approvedBy: status === 'approved' ? officerName : adv.approvedBy,
            approvedAt: status === 'approved' ? new Date().toISOString() : adv.approvedAt,
          };
        }
        return adv;
      })
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-officer-01',
      userName: officerName,
      userRole: 'officer',
      action: `ADVISORY_${status.toUpperCase()}`,
      targetEntity: 'AgrometAdvisory',
      targetId: id,
      details: `Advisory ${id} set to ${status}`,
      status: 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const createAdvisory = (
    advisory: Omit<AgrometAdvisory, 'id' | 'createdAt' | 'helpfulCount' | 'unhelpfulCount'>
  ) => {
    const newAdv: AgrometAdvisory = {
      ...advisory,
      id: `adv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      unhelpfulCount: 0,
    };
    setAdvisories((prev) => [newAdv, ...prev]);

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-officer-01',
      userName: advisory.approvedBy || 'Agricultural Officer',
      userRole: 'officer',
      action: 'CREATED_ADVISORY',
      targetEntity: 'AgrometAdvisory',
      targetId: newAdv.id,
      details: `New advisory created for ${advisory.panchayatNameEn}`,
      status: 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const broadcastAlert = (alert: Omit<WeatherAlert, 'id' | 'issuedAt' | 'isActive'>) => {
    const newAlert: WeatherAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      issuedAt: new Date().toISOString(),
      isActive: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-officer-01',
      userName: alert.issuedBy,
      userRole: 'officer',
      action: 'BROADCAST_ALERT',
      targetEntity: 'WeatherAlert',
      targetId: newAlert.id,
      details: `Broadcasted alert: ${alert.headlineEn}`,
      status: 'warning',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const toggleAlertActive = (id: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, isActive: !alt.isActive } : alt))
    );
  };

  const submitFeedback = (feedback: Omit<FeedbackSubmission, 'id' | 'submittedAt'>) => {
    const newFeedback: FeedbackSubmission = {
      ...feedback,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);

    setAdvisories((prev) =>
      prev.map((adv) => {
        if (adv.id === feedback.advisoryId) {
          return {
            ...adv,
            helpfulCount: feedback.isHelpful ? adv.helpfulCount + 1 : adv.helpfulCount,
            unhelpfulCount: !feedback.isHelpful ? adv.unhelpfulCount + 1 : adv.unhelpfulCount,
          };
        }
        return adv;
      })
    );
  };

  const voteAdvisoryHelpful = (id: string, isHelpful: boolean) => {
    setAdvisories((prev) =>
      prev.map((adv) => {
        if (adv.id === id) {
          return {
            ...adv,
            helpfulCount: isHelpful ? adv.helpfulCount + 1 : adv.helpfulCount,
            unhelpfulCount: !isHelpful ? adv.unhelpfulCount + 1 : adv.unhelpfulCount,
          };
        }
        return adv;
      })
    );
  };

  // --- Advisory Knowledge Base Rule Actions ---
  const createRule = (
    ruleData: Omit<AdvisoryRule, 'id' | 'createdAt' | 'versionHistory' | 'version'> & { initialVersion?: string }
  ) => {
    const newId = `rule-${Date.now()}`;
    const initialVer = ruleData.initialVersion || 'v1.0';
    const nowIso = new Date().toISOString();

    const newRule: AdvisoryRule = {
      ...ruleData,
      id: newId,
      version: initialVer,
      createdAt: nowIso,
      versionHistory: [
        {
          version: initialVer,
          modifiedBy: ruleData.createdBy,
          modifiedAt: nowIso,
          changeSummary: 'Initial rule draft created.',
          status: ruleData.approvalStatus || 'draft',
        },
      ],
    };

    setAdvisoryRules((prev) => [newRule, ...prev]);

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: nowIso,
      userId: 'usr-admin-01',
      userName: ruleData.createdBy,
      userRole: 'admin',
      action: 'CREATED_ADVISORY_RULE',
      targetEntity: 'AdvisoryRule',
      targetId: newRule.ruleCode,
      details: `Created advisory rule [${newRule.ruleCode}] for ${newRule.cropNameEn} (${newRule.stageNameEn})`,
      status: 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const updateRule = (
    id: string,
    updated: Partial<AdvisoryRule>,
    changeSummary: string,
    modifierName: string
  ) => {
    const nowIso = new Date().toISOString();
    let targetRuleCode = id;

    setAdvisoryRules((prev) =>
      prev.map((rule) => {
        if (rule.id === id) {
          targetRuleCode = rule.ruleCode;
          // Calculate next minor version e.g. v1.1 -> v1.2
          const match = rule.version.match(/^v?(\d+)\.(\d+)$/);
          const nextVersion = match
            ? `v${match[1]}.${parseInt(match[2], 10) + 1}`
            : `${rule.version}.1`;

          const newHistoryRecord = {
            version: nextVersion,
            modifiedBy: modifierName,
            modifiedAt: nowIso,
            changeSummary: changeSummary || 'Updated rule parameters/triggers.',
            status: updated.approvalStatus || rule.approvalStatus,
            reviewedBy: rule.reviewer,
          };

          return {
            ...rule,
            ...updated,
            version: nextVersion,
            versionHistory: [newHistoryRecord, ...(rule.versionHistory || [])],
          };
        }
        return rule;
      })
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: nowIso,
      userId: 'usr-admin-01',
      userName: modifierName,
      userRole: 'admin',
      action: 'UPDATED_ADVISORY_RULE',
      targetEntity: 'AdvisoryRule',
      targetId: targetRuleCode,
      details: `Updated rule parameters: ${changeSummary}`,
      status: 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const reviewRule = (
    id: string,
    status: RuleApprovalStatus,
    reviewerName: string,
    reviewNotes?: string
  ) => {
    const nowIso = new Date().toISOString();
    let targetRuleCode = id;

    setAdvisoryRules((prev) =>
      prev.map((rule) => {
        if (rule.id === id) {
          targetRuleCode = rule.ruleCode;
          const newHistoryRecord = {
            version: rule.version,
            modifiedBy: reviewerName,
            modifiedAt: nowIso,
            changeSummary: `Rule status updated to '${status}': ${reviewNotes || 'Review completed.'}`,
            status,
            reviewedBy: reviewerName,
          };

          return {
            ...rule,
            approvalStatus: status,
            reviewer: reviewerName,
            reviewedAt: nowIso,
            reviewNotes: reviewNotes || rule.reviewNotes,
            versionHistory: [newHistoryRecord, ...(rule.versionHistory || [])],
          };
        }
        return rule;
      })
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: nowIso,
      userId: 'usr-officer-01',
      userName: reviewerName,
      userRole: 'officer',
      action: `RULE_${status.toUpperCase()}`,
      targetEntity: 'AdvisoryRule',
      targetId: targetRuleCode,
      details: `Rule ${status}: ${reviewNotes || 'No additional review remarks'}`,
      status: status === 'rejected' ? 'warning' : 'success',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const publishRule = (id: string, publisherName: string, notes?: string) => {
    reviewRule(id, 'published', publisherName, notes || 'Published to active agromet rules engine pipeline.');
  };

  const rejectRule = (id: string, reviewerName: string, reason: string) => {
    reviewRule(id, 'rejected', reviewerName, reason || 'Rule rejected during verification.');
  };

  const deleteRule = (id: string, deleterName: string) => {
    const target = advisoryRules.find((r) => r.id === id);
    setAdvisoryRules((prev) => prev.filter((r) => r.id !== id));

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-admin-01',
      userName: deleterName,
      userRole: 'admin',
      action: 'DELETED_ADVISORY_RULE',
      targetEntity: 'AdvisoryRule',
      targetId: target ? target.ruleCode : id,
      details: `Deleted advisory rule [${target ? target.ruleCode : id}]`,
      status: 'warning',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const resetRulesToDefault = () => {
    setAdvisoryRules(INITIAL_MOCK_ADVISORY_RULES);
    try {
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ADVISORY_RULES));
    } catch {
      // ignore
    }
  };

  return (
    <MockDataContext.Provider
      value={{
        advisories,
        observations,
        alerts,
        feedbacks,
        auditLogs,
        advisoryRules,
        addObservation,
        updateObservationStatus,
        updateAdvisoryStatus,
        createAdvisory,
        broadcastAlert,
        toggleAlertActive,
        submitFeedback,
        voteAdvisoryHelpful,
        voteAdvisoryFeedback: voteAdvisoryHelpful,
        createRule,
        updateRule,
        reviewRule,
        publishRule,
        rejectRule,
        deleteRule,
        resetRulesToDefault,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
