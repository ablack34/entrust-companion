import React, { useState } from 'react';
import {
  Card,
  Text,
  Button,
  makeStyles,
  tokens,
  Dropdown,
  Option,
  Checkbox,
  Slider,
  ProgressBar,
  Tooltip,
  Spinner,
  Divider,
} from '@fluentui/react-components';
import { ArrowLeft24Regular, Play24Regular, Info16Regular } from '@fluentui/react-icons';
import { useApp, useActiveRun } from '../context/AppContext';
import { Persona, ScoringWeights } from '../types';
import { mockRecommendations } from '../data/mockData';

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
  stepper: {
    marginBottom: '32px',
  },
  stepperLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  filtersRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterItem: {
    flex: '1 1 200px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  personaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
    padding: '8px 0',
  },
  personaLabel: {
    flex: '1 1 250px',
  },
  prioritySlider: {
    flex: '0 0 200px',
  },
  priorityValue: {
    flex: '0 0 40px',
    textAlign: 'right' as const,
  },
  weightRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
    padding: '4px 0',
  },
  weightLabel: {
    flex: '1 1 200px',
  },
  weightSlider: {
    flex: '0 0 300px',
  },
  weightValue: {
    flex: '0 0 50px',
    textAlign: 'right' as const,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '32px',
  },
  tip: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: '6px',
    marginTop: '16px',
  },
  processingOverlay: {
    textAlign: 'center',
    padding: '64px 32px',
  },
  processingStep: {
    marginTop: '12px',
    color: tokens.colorNeutralForeground3,
  },
});

const defaultPersonas: Persona[] = [
  { id: 'ciso', title: 'CISO / VP Security', enabled: true, priority: 95 },
  { id: 'it-dir', title: 'IT Director / Infrastructure', enabled: true, priority: 80 },
  { id: 'iam-lead', title: 'Identity & Access Mgmt Lead', enabled: true, priority: 70 },
  { id: 'procurement', title: 'Procurement / Vendor Mgmt', enabled: false, priority: 40 },
  { id: 'cto-cio', title: 'CTO / CIO', enabled: false, priority: 60 },
];

const defaultWeights: ScoringWeights = {
  personaFit: 80,
  companySizeMatch: 60,
  industryRelevance: 70,
  crmSignals: 40,
  webIntentSignals: 30,
};

const ConfigureRules: React.FC = () => {
  const styles = useStyles();
  const { dispatch } = useApp();
  const activeRun = useActiveRun();

  const [productLine, setProductLine] = useState('PKI / Certificate Solutions');
  const [region, setRegion] = useState('EMEA');
  const [segment, setSegment] = useState('Enterprise (1000+ employees)');
  const [personas, setPersonas] = useState<Persona[]>(defaultPersonas);
  const [weights, setWeights] = useState<ScoringWeights>(defaultWeights);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const togglePersona = (id: string) => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const updatePersonaPriority = (id: string, priority: number) => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priority } : p))
    );
  };

  const updateWeight = (key: keyof ScoringWeights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleRun = () => {
    if (!activeRun) return;

    // Save config
    dispatch({
      type: 'SET_RUN_CONFIG',
      payload: {
        runId: activeRun.id,
        config: { productLine, region, segment, personas, weights },
      },
    });

    // Simulate processing
    setIsProcessing(true);
    const messages = [
      `Analyzing ${activeRun.accountCount.toLocaleString()} accounts...`,
      'Querying Salesforce data via Microsoft Graph...',
      'Matching personas across contacts...',
      'Scoring & ranking by weighted criteria...',
      'Generating explanations...',
      'Flagging accounts that need review...',
    ];

    let step = 0;
    setProcessingMessage(messages[0]);

    const interval = setInterval(() => {
      step++;
      if (step < messages.length) {
        setProcessingMessage(messages[step]);
      } else {
        clearInterval(interval);
        // Set recommendations and move to results
        dispatch({
          type: 'SET_RECOMMENDATIONS',
          payload: { runId: activeRun.id, recommendations: mockRecommendations },
        });
        dispatch({ type: 'SET_STEP', payload: 3 });
      }
    }, 1200);
  };

  if (isProcessing) {
    return (
      <div className={styles.container}>
        <Card className={styles.processingOverlay}>
          <Spinner size="huge" label="" />
          <Text size={600} weight="semibold" block style={{ marginTop: '24px' }}>
            Running Prioritization
          </Text>
          <Text className={styles.processingStep} block>
            {processingMessage}
          </Text>
          <div style={{ maxWidth: '400px', margin: '24px auto 0' }}>
            <ProgressBar />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={handleBack} />
        <Text size={700} weight="bold">
          Configure Persona Rules
        </Text>
      </div>

      <div className={styles.stepper}>
        <ProgressBar value={0.66} thickness="large" color="brand" />
        <div className={styles.stepperLabels}>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>1. Import</Text>
          <Text weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
            2. Configure
          </Text>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>3. Review</Text>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersRow}>
        <div className={styles.filterItem}>
          <Text size={300} weight="semibold" block style={{ marginBottom: '4px' }}>
            Product Line
          </Text>
          <Dropdown
            value={productLine}
            onOptionSelect={(_, data) => setProductLine(data.optionValue ?? productLine)}
            style={{ width: '100%' }}
          >
            <Option value="PKI / Certificate Solutions">PKI / Certificate Solutions</Option>
            <Option value="Identity & Access Management">Identity & Access Management</Option>
            <Option value="Digital Signing">Digital Signing</Option>
          </Dropdown>
        </div>
        <div className={styles.filterItem}>
          <Text size={300} weight="semibold" block style={{ marginBottom: '4px' }}>
            Region
          </Text>
          <Dropdown
            value={region}
            onOptionSelect={(_, data) => setRegion(data.optionValue ?? region)}
            style={{ width: '100%' }}
          >
            <Option value="EMEA">EMEA</Option>
            <Option value="North America">North America</Option>
            <Option value="APAC">APAC</Option>
          </Dropdown>
        </div>
        <div className={styles.filterItem}>
          <Text size={300} weight="semibold" block style={{ marginBottom: '4px' }}>
            Segment
          </Text>
          <Dropdown
            value={segment}
            onOptionSelect={(_, data) => setSegment(data.optionValue ?? segment)}
            style={{ width: '100%' }}
          >
            <Option value="Enterprise (1000+ employees)">Enterprise (1000+ employees)</Option>
            <Option value="Mid-Market (200-999)">Mid-Market (200–999)</Option>
            <Option value="SMB (< 200)">{'SMB (< 200)'}</Option>
          </Dropdown>
        </div>
      </div>

      <Divider />

      {/* Target Personas */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Text size={500} weight="semibold">
            Target Personas
          </Text>
          <Tooltip content="Select the buyer personas you want the AI to prioritize. Higher priority = stronger weighting in the scoring." relationship="description">
            <Info16Regular style={{ color: tokens.colorNeutralForeground3, cursor: 'help' }} />
          </Tooltip>
        </div>

        {personas.map((p) => (
          <div key={p.id} className={styles.personaRow}>
            <div className={styles.personaLabel}>
              <Checkbox
                checked={p.enabled}
                onChange={() => togglePersona(p.id)}
                label={p.title}
              />
            </div>
            <div className={styles.prioritySlider}>
              <Slider
                min={0}
                max={100}
                value={p.priority}
                disabled={!p.enabled}
                onChange={(_, data) => updatePersonaPriority(p.id, data.value)}
              />
            </div>
            <div className={styles.priorityValue}>
              <Text
                weight="semibold"
                style={{ color: p.enabled ? tokens.colorBrandForeground1 : tokens.colorNeutralForeground4 }}
              >
                {p.priority}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Scoring Weights */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Text size={500} weight="semibold">
            Scoring Weights
          </Text>
          <Tooltip content="Adjust how much each factor influences the overall account score." relationship="description">
            <Info16Regular style={{ color: tokens.colorNeutralForeground3, cursor: 'help' }} />
          </Tooltip>
        </div>

        {([
          ['personaFit', 'Persona fit'],
          ['companySizeMatch', 'Company size match'],
          ['industryRelevance', 'Industry relevance'],
          ['crmSignals', 'Existing CRM signals'],
          ['webIntentSignals', 'Web / intent signals'],
        ] as [keyof ScoringWeights, string][]).map(([key, label]) => (
          <div key={key} className={styles.weightRow}>
            <div className={styles.weightLabel}>
              <Text>{label}</Text>
            </div>
            <div className={styles.weightSlider}>
              <Slider
                min={0}
                max={100}
                value={weights[key]}
                onChange={(_, data) => updateWeight(key, data.value)}
              />
            </div>
            <div className={styles.weightValue}>
              <Text weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>
                {weights[key]}%
              </Text>
            </div>
          </div>
        ))}

        <div className={styles.tip}>
          <Info16Regular style={{ color: tokens.colorBrandForeground1, marginTop: '2px', flexShrink: 0 }} />
          <Text size={200}>
            <strong>Tip:</strong> Higher weights mean the AI prioritizes that factor more when ranking
            your accounts. For new market penetration, increase Persona Fit and Industry Relevance.
            For cross-sell into existing accounts, increase CRM Signals.
          </Text>
        </div>
      </div>

      <div className={styles.footer}>
        <Button appearance="outline" onClick={handleBack}>
          Back
        </Button>
        <Button appearance="primary" icon={<Play24Regular />} iconPosition="before" onClick={handleRun}>
          Run Prioritization
        </Button>
      </div>
    </div>
  );
};

export default ConfigureRules;
