'use client';
import { CrudTable } from '@/components/admin/crud-table';
export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Projects</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage projects content shown on the public site.</p>
      <CrudTable
        table="projects"
        orderBy="order_index"
        allowReorder
        columns={['title', 'tags', 'is_featured', 'is_visible', 'order_index']}
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'thumbnail_url', label: 'Thumbnail URL', type: 'url' },
          { name: 'tags', label: 'Tags', type: 'tags' },
          { name: 'demo_url', label: 'Live demo URL', type: 'url' },
          { name: 'github_url', label: 'GitHub URL', type: 'url' },
          { name: 'client', label: 'Client', type: 'text' },
          { name: 'role', label: 'Role', type: 'text' },
          { name: 'duration', label: 'Duration', type: 'text' },
          { name: 'case_study', label: 'Case study (HTML)', type: 'textarea' },
          { name: 'is_featured', label: 'Featured', type: 'boolean' },
          { name: 'is_visible', label: 'Visible', type: 'boolean' },
          { name: 'order_index', label: 'Order', type: 'number' },
        ]}
      />
    </div>
  );
}
