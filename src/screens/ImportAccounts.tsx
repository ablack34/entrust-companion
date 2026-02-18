import React, { useState, useCallback } from 'react';
import {
  Card,
  Text,
  Button,
  makeStyles,
  tokens,
  Dropdown,
  Option,
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  ProgressBar,
} from '@fluentui/react-components';
import { ArrowLeft24Regular, ArrowRight24Regular, ArrowUpload24Regular } from '@fluentui/react-icons';
import { useApp, useActiveRun } from '../context/AppContext';
import { TargetAccount } from '../types';
import { mockParsedAccounts } from '../data/mockData';
import Papa from 'papaparse';

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
  uploadZone: {
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: '8px',
    padding: '48px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '24px',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '0.2s',
  },
  uploadZoneDragOver: {
    border: `2px dashed ${tokens.colorBrandStroke1}`,
    borderRadius: '8px',
    padding: '48px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '24px',
    backgroundColor: tokens.colorBrandBackground2,
  },
  orDivider: {
    textAlign: 'center',
    margin: '16px 0',
    color: tokens.colorNeutralForeground3,
  },
  previewSection: {
    marginTop: '24px',
    marginBottom: '24px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '32px',
  },
  detectedInfo: {
    marginTop: '12px',
    marginBottom: '12px',
  },
});

const ImportAccounts: React.FC = () => {
  const styles = useStyles();
  const { dispatch } = useApp();
  const activeRun = useActiveRun();
  const [parsedAccounts, setParsedAccounts] = useState<TargetAccount[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedList, setSelectedList] = useState<string>('');

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 0 });
  };

  const parseCSV = useCallback((file: File) => {
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Map CSV rows to TargetAccount — in a real app we'd do column mapping
        const accounts: TargetAccount[] = results.data.slice(0, 100).map((row: any, i: number) => ({
          id: `acc-${i + 1}`,
          companyName: row['Company'] || row['CompanyName'] || row['company_name'] || `Company ${i + 1}`,
          domain: row['Domain'] || row['domain'] || '',
          industry: row['Industry'] || row['industry'] || 'Unknown',
          employeeCount: parseInt(row['Employees'] || row['EmployeeCount'] || row['employee_count'] || '0', 10),
          hqCountry: row['Country'] || row['HQCountry'] || '',
          hqCity: row['City'] || row['HQCity'] || '',
          goodfitScore: parseInt(row['GoodfitScore'] || row['Score'] || '50', 10),
          annualRevenue: parseFloat(row['Revenue'] || row['AnnualRevenue'] || '0') || undefined,
          productFitTags: (row['ProductFitTags'] || row['Tags'] || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          enrichmentNotes: row['Notes'] || row['EnrichmentNotes'] || '',
        }));
        setParsedAccounts(accounts.length > 0 ? accounts : mockParsedAccounts);
      },
      error: () => {
        // On parse error, use mock data for demo
        setParsedAccounts(mockParsedAccounts);
      },
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseCSV(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseCSV(file);
  };

  const handleUseMockData = () => {
    setParsedAccounts(mockParsedAccounts);
    setFileName('goodfit_emea_pki_q1_2026.csv');
  };

  const handleSelectList = (_: any, data: any) => {
    setSelectedList(data.optionValue ?? '');
    if (data.optionValue) {
      setParsedAccounts(mockParsedAccounts);
      setFileName('');
    }
  };

  const handleNext = () => {
    if (activeRun && parsedAccounts.length > 0) {
      dispatch({
        type: 'IMPORT_ACCOUNTS',
        payload: { runId: activeRun.id, accounts: parsedAccounts },
      });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  const previewColumns: TableColumnDefinition<TargetAccount>[] = [
    createTableColumn<TargetAccount>({
      columnId: 'company',
      renderHeaderCell: () => 'Company',
      renderCell: (item) => <Text weight="semibold">{item.companyName}</Text>,
    }),
    createTableColumn<TargetAccount>({
      columnId: 'domain',
      renderHeaderCell: () => 'Domain',
      renderCell: (item) => <Text>{item.domain}</Text>,
    }),
    createTableColumn<TargetAccount>({
      columnId: 'industry',
      renderHeaderCell: () => 'Industry',
      renderCell: (item) => <Text>{item.industry}</Text>,
    }),
    createTableColumn<TargetAccount>({
      columnId: 'size',
      renderHeaderCell: () => 'Employees',
      renderCell: (item) => <Text>{item.employeeCount.toLocaleString()}</Text>,
    }),
    createTableColumn<TargetAccount>({
      columnId: 'score',
      renderHeaderCell: () => 'Goodfit Score',
      renderCell: (item) => <Text>{item.goodfitScore}</Text>,
    }),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={handleBack} />
        <Text size={700} weight="bold">
          Import Accounts
        </Text>
      </div>

      <div className={styles.stepper}>
        <ProgressBar value={0.33} thickness="large" color="brand" />
        <div className={styles.stepperLabels}>
          <Text weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
            1. Import
          </Text>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>2. Configure</Text>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>3. Review</Text>
        </div>
      </div>

      <Card>
        <div
          className={isDragOver ? styles.uploadZoneDragOver : styles.uploadZone}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('csv-upload')?.click()}
        >
          <ArrowUpload24Regular style={{ fontSize: 48, color: tokens.colorBrandForeground1, marginBottom: 8 }} />
          <Text size={500} block weight="semibold">
            {fileName || 'Drop CSV here or click to browse'}
          </Text>
          <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
            Supports Goodfit export format (.csv)
          </Text>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        <div className={styles.orDivider}>
          <Text>— OR —</Text>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Dropdown
            placeholder="Select existing SharePoint list..."
            style={{ minWidth: '300px' }}
            onOptionSelect={handleSelectList}
            value={selectedList}
          >
            <Option value="emea-pki-q1">EMEA Target Accounts — PKI Q1 2026</Option>
            <Option value="na-iam-q1">NA Target Accounts — IAM Q1 2026</Option>
            <Option value="apac-signing-q1">APAC Target Accounts — Digital Signing Q1 2026</Option>
          </Dropdown>

          <Button appearance="outline" onClick={handleUseMockData}>
            Use Demo Data
          </Button>
        </div>
      </Card>

      {parsedAccounts.length > 0 && (
        <div className={styles.previewSection}>
          <MessageBar intent="success">
            <MessageBarBody>
              <MessageBarTitle>File parsed successfully</MessageBarTitle>
            </MessageBarBody>
          </MessageBar>

          <div className={styles.detectedInfo}>
            <Text weight="semibold">
              Detected: {parsedAccounts.length.toLocaleString()} accounts
            </Text>
          </div>

          <Text size={400} weight="semibold" block style={{ marginBottom: '8px' }}>
            Preview (first 5 rows):
          </Text>
          <DataGrid
            items={parsedAccounts.slice(0, 5)}
            columns={previewColumns}
            getRowId={(item) => item.id}
          >
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<TargetAccount>>
              {({ item, rowId }) => (
                <DataGridRow<TargetAccount> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        </div>
      )}

      <div className={styles.footer}>
        <Button appearance="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button
          appearance="primary"
          icon={<ArrowRight24Regular />}
          iconPosition="after"
          disabled={parsedAccounts.length === 0}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ImportAccounts;
