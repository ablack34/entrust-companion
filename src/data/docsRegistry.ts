export interface DocEntry {
  slug: string;
  title: string;
  filename: string;
}

export const docsRegistry: DocEntry[] = [
  {
    slug: 'requirements',
    title: 'Requirements',
    filename: 'Entrust Prospect Prioritization Companion — Requirements.md',
  },
  {
    slug: 'story',
    title: 'Product Story',
    filename: 'Entrust Prospect Prioritization Companion — Story.md',
  },
  {
    slug: 'playbook',
    title: 'Prototype Playbook',
    filename: 'Prototype Playbook.md',
  },
];
