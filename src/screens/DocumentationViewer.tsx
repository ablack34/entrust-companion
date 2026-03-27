import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  makeStyles,
  tokens,
  Card,
  Title2,
  Spinner,
  MessageBar,
  MessageBarBody,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import { useApp } from '../context/AppContext';
import { docsRegistry } from '../data/docsRegistry';

const useStyles = makeStyles({
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
  },
  breadcrumb: {
    marginBottom: '16px',
  },
  card: {
    padding: '32px',
  },
  markdown: {
    lineHeight: '1.7',
    '& h1': {
      fontSize: '28px',
      fontWeight: 700,
      marginTop: '32px',
      marginBottom: '16px',
      color: tokens.colorNeutralForeground1,
    },
    '& h2': {
      fontSize: '22px',
      fontWeight: 600,
      marginTop: '28px',
      marginBottom: '12px',
      color: tokens.colorNeutralForeground1,
    },
    '& h3': {
      fontSize: '18px',
      fontWeight: 600,
      marginTop: '24px',
      marginBottom: '8px',
      color: tokens.colorNeutralForeground1,
    },
    '& p': {
      marginBottom: '12px',
      color: tokens.colorNeutralForeground2,
    },
    '& ul, & ol': {
      paddingLeft: '24px',
      marginBottom: '12px',
    },
    '& li': {
      marginBottom: '4px',
      color: tokens.colorNeutralForeground2,
    },
    '& table': {
      borderCollapse: 'collapse' as const,
      width: '100%',
      marginBottom: '16px',
    },
    '& th, & td': {
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      padding: '8px 12px',
      textAlign: 'left' as const,
    },
    '& th': {
      backgroundColor: tokens.colorNeutralBackground3,
      fontWeight: 600,
    },
    '& code': {
      backgroundColor: tokens.colorNeutralBackground3,
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '13px',
    },
    '& pre': {
      backgroundColor: tokens.colorNeutralBackground3,
      padding: '16px',
      borderRadius: '8px',
      overflowX: 'auto' as const,
      marginBottom: '16px',
    },
    '& blockquote': {
      borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
      paddingLeft: '16px',
      margin: '16px 0',
      color: tokens.colorNeutralForeground3,
    },
    '& hr': {
      border: 'none',
      borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
      margin: '24px 0',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '48px',
  },
});

const DocumentationViewer: React.FC = () => {
  const styles = useStyles();
  const { state, dispatch } = useApp();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const doc = docsRegistry.find((d) => d.slug === state.activeDocSlug);

  useEffect(() => {
    if (!doc) return;
    setLoading(true);
    setError(null);

    const encodedFilename = encodeURIComponent(doc.filename);
    fetch(`${process.env.PUBLIC_URL}/docs/${encodedFilename}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load document`);
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load this document.');
        setLoading(false);
      });
  }, [doc]);

  const goHome = () => dispatch({ type: 'SET_STEP', payload: 0 });

  if (!doc) {
    return (
      <div className={styles.container}>
        <MessageBar intent="error">
          <MessageBarBody>Document not found.</MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <BreadcrumbItem>
          <BreadcrumbButton onClick={goHome}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current>{doc.title}</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>

      <Card className={styles.card}>
        {loading ? (
          <div className={styles.center}>
            <Spinner label="Loading document…" />
          </div>
        ) : error ? (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        ) : (
          <>
            <Title2>{doc.title}</Title2>
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default DocumentationViewer;
