import React, { useMemo, useState } from 'react';
import {
  Card,
  Text,
  Button,
  makeStyles,
  tokens,
  Textarea,
  Badge,
  Divider,
  Tooltip,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import {
  ArrowLeft24Regular,
  ArrowDownload24Regular,
  Mail24Regular,
  Copy24Regular,
  Edit24Regular,
  Checkmark16Regular,
  Info16Regular,
  Database16Regular,
  Globe16Regular,
  QuestionCircle16Regular,
  MailWarning16Regular,
} from '@fluentui/react-icons';
import { useApp, useActiveRun } from '../context/AppContext';
import { OutreachDraft } from '../types';
import { mockOutreachDrafts } from '../data/mockData';

const useStyles = makeStyles({
  container: {
    padding: '32px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  summary: {
    marginBottom: '24px',
  },
  draftCard: {
    marginBottom: '20px',
    padding: '20px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '8px',
  },
  draftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  draftTo: {
    marginBottom: '4px',
  },
  subjectLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '4px',
  },
  draftBody: {
    marginBottom: '16px',
  },
  personalizationNote: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: '4px',
    marginBottom: '12px',
  },
  draftActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  exportSection: {
    marginTop: '32px',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '8px',
  },
  exportButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  tip: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderRadius: '6px',
    marginTop: '16px',
  },
  copiedBadge: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
  contactProvenance: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginBottom: '12px',
  },
  provenanceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  provenanceSalesforce: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
  },
  provenanceInferred: {
    backgroundColor: tokens.colorPaletteMarigoldBackground1,
    color: tokens.colorPaletteMarigoldForeground1,
  },
  emailWarningBar: {
    marginBottom: '12px',
  },
});

const OutreachPack: React.FC = () => {
  const styles = useStyles();
  const { dispatch } = useApp();
  const activeRun = useActiveRun();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedBodies, setEditedBodies] = useState<Record<number, string>>({});
  const [, setCopiedIndex] = useState<number | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  // Use real drafts if available, otherwise mock
  const drafts: OutreachDraft[] = activeRun?.outreachDrafts ?? mockOutreachDrafts;

  const approvedRecs = useMemo(
    () => activeRun?.recommendations?.filter((r) => r.status === 'approved') ?? [],
    [activeRun]
  );

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const handleCopy = (draft: OutreachDraft, index: number) => {
    const text = `Subject: ${draft.subject}\n\n${editedBodies[index] ?? draft.body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const handleOpenInOutlook = (draft: OutreachDraft, index: number) => {
    const body = editedBodies[index] ?? draft.body;
    const email = draft.contactEmail ?? '';
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleDownloadCSV = () => {
    const rows = drafts.map((d) => ({
      Contact: d.contactName,
      Title: d.contactTitle,
      Account: d.accountName,
      Subject: d.subject,
      Body: (editedBodies[drafts.indexOf(d)] ?? d.body).replace(/\n/g, ' '),
    }));

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map((r) =>
        Object.values(r)
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach-pack-${activeRun?.name?.replace(/\s+/g, '-') ?? 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPack = () => {
    // In a real app, this would bundle CSV + messaging + AI summaries
    // For prototype, download the same CSV
    handleDownloadCSV();
  };

  return (
    <div className={styles.container}>
      {showCopied && (
        <div className={styles.copiedBadge}>
          <Badge appearance="filled" color="success" icon={<Checkmark16Regular />}>
            Copied to clipboard
          </Badge>
        </div>
      )}

      <div className={styles.header}>
        <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={handleBack} />
        <Text size={700} weight="bold">
          Outreach Pack
        </Text>
        {activeRun && (
          <Text size={400} style={{ color: tokens.colorNeutralForeground3 }}>
            — {activeRun.name}
          </Text>
        )}
      </div>

      <div className={styles.summary}>
        <Text size={400}>
          <strong>{approvedRecs.length || drafts.length}</strong> accounts ·{' '}
          <strong>{drafts.length}</strong> draft messages ready
        </Text>
      </div>

      <Text size={500} weight="semibold" block style={{ marginBottom: '16px' }}>
        Draft Messaging
      </Text>

      {drafts.map((draft, index) => (
        <Card key={index} className={styles.draftCard}>
          <div className={styles.draftHeader}>
            <div>
              <div className={styles.draftTo}>
                <Text weight="semibold">To: {draft.contactName}</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  , {draft.contactTitle} — {draft.accountName}
                </Text>
              </div>
              {draft.contactEmail && (
                <Text size={200} style={{ color: tokens.colorBrandForeground1 }}>
                  {draft.contactEmail}
                </Text>
              )}
            </div>
            <Badge appearance="outline" color="informative" size="small">
              AI-drafted
            </Badge>
          </div>

          {/* Contact data provenance badges */}
          <div className={styles.contactProvenance}>
            <span className={`${styles.provenanceBadge} ${
              draft.contactSource === 'salesforce' ? styles.provenanceSalesforce : styles.provenanceInferred
            }`}>
              {draft.contactSource === 'salesforce' && <><Database16Regular /> Contact from Salesforce</>}
              {draft.contactSource === 'goodfit' && <><Globe16Regular /> Contact from Goodfit</>}
              {draft.contactSource === 'inferred' && <><QuestionCircle16Regular /> Contact inferred — not CRM-validated</>}
            </span>
            {draft.contactEmail && (
              <span className={`${styles.provenanceBadge} ${
                draft.contactEmailSource === 'salesforce' ? styles.provenanceSalesforce : styles.provenanceInferred
              }`}>
                {draft.contactEmailSource === 'salesforce' ? '✓ Email CRM-verified' : '⚠ Email pattern-guessed'}
              </span>
            )}
            {draft.contactDiscovery === 'matched' && (
              <Badge appearance="outline" color="success" size="small">Domain matched</Badge>
            )}
            {draft.contactDiscovery === 'inferred' && (
              <Badge appearance="outline" color="warning" size="small">Inferred match — verify before sending</Badge>
            )}
          </div>

          {/* Missing email warning */}
          {!draft.contactEmail && (
            <div className={styles.emailWarningBar}>
              <MessageBar intent="warning" icon={<MailWarning16Regular />}>
                <MessageBarBody>
                  <strong>Email unavailable.</strong> This contact has no email address in Salesforce. 
                  You'll need to manually find their email (e.g., via LinkedIn or company directory) 
                  before sending this outreach.
                </MessageBarBody>
              </MessageBar>
            </div>
          )}

          <div className={styles.subjectLine}>
            <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>
              Subject:
            </Text>
            <Text weight="semibold">{draft.subject}</Text>
          </div>

          <div className={styles.draftBody}>
            {editingIndex === index ? (
              <Textarea
                value={editedBodies[index] ?? draft.body}
                onChange={(_, data) =>
                  setEditedBodies((prev) => ({ ...prev, [index]: data.value }))
                }
                resize="vertical"
                style={{ width: '100%', minHeight: '200px' }}
              />
            ) : (
              <Text
                style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                block
              >
                {editedBodies[index] ?? draft.body}
              </Text>
            )}
          </div>

          {/* Personalization note */}
          <div className={styles.personalizationNote}>
            <Info16Regular style={{ color: tokens.colorBrandForeground1, flexShrink: 0, marginTop: '2px' }} />
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              <strong>Personalization:</strong> {draft.personalizationNotes}
            </Text>
          </div>

          <Divider />

          <div className={styles.draftActions}>
            <Button
              appearance="outline"
              size="small"
              icon={<Edit24Regular />}
              onClick={() => setEditingIndex(editingIndex === index ? null : index)}
            >
              {editingIndex === index ? 'Done editing' : 'Edit draft'}
            </Button>
            <Button
              appearance="outline"
              size="small"
              icon={<Copy24Regular />}
              onClick={() => handleCopy(draft, index)}
            >
              Copy
            </Button>
            <Button
              appearance="primary"
              size="small"
              icon={<Mail24Regular />}
              onClick={() => handleOpenInOutlook(draft, index)}
              disabled={!draft.contactEmail}
              title={!draft.contactEmail ? 'Email address unavailable — add manually before sending' : undefined}
            >
              {draft.contactEmail ? 'Open in Outlook' : 'No email — add manually'}
            </Button>
          </div>
        </Card>
      ))}

      {/* Export Section */}
      <div className={styles.exportSection}>
        <Text size={500} weight="semibold" block>
          Export Options
        </Text>
        <div className={styles.exportButtons}>
          <Button
            appearance="outline"
            icon={<ArrowDownload24Regular />}
            onClick={handleDownloadCSV}
          >
            Download CSV — Account + contact list
          </Button>
          <Button
            appearance="outline"
            icon={<ArrowDownload24Regular />}
            onClick={handleDownloadPack}
          >
            Download Full Pack — CSV + messaging + AI summaries
          </Button>
          <Tooltip content="Creates draft emails in Outlook for each contact" relationship="description">
            <Button
              appearance="primary"
              icon={<Mail24Regular />}
              onClick={() => drafts.forEach((d, i) => handleOpenInOutlook(d, i))}
            >
              Open All in Outlook
            </Button>
          </Tooltip>
        </div>

        <div className={styles.tip}>
          <Info16Regular style={{ color: tokens.colorPaletteYellowForeground2, flexShrink: 0, marginTop: '2px' }} />
          <Text size={200}>
            <strong>Tip:</strong> "Open in Outlook" creates a draft with this messaging pre-filled. Use{' '}
            <strong>Copilot in Outlook</strong> to further personalize each message before sending — 
            try asking it to "incorporate this prospect's recent company news" for an extra personal touch.
          </Text>
        </div>
      </div>

      <MessageBar intent="info" style={{ marginTop: '24px' }}>
        <MessageBarBody>
          <strong>What's next?</strong> After sending outreach, CRM write-back and engagement tracking
          are on the roadmap. For now, update Salesforce manually with the exported data.
        </MessageBarBody>
      </MessageBar>
    </div>
  );
};

export default OutreachPack;
