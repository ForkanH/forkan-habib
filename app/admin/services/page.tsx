'use client';
import { CrudTable } from '@/components/admin/crud-table';
export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Services</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage services content shown on the public site.</p>
      <CrudTable
        table="services"
        orderBy="order_index"
        allowReorder
        columns={['title','price','is_visible','order_index']}
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'icon', label: 'Icon (lucide name, e.g. Workflow)', type: 'text' },
          { name: 'price', label: 'Starting price', type: 'text' },
          { name: 'cta_link', label: 'CTA link', type: 'url' },
          { name: 'is_visible', label: 'Visible', type: 'boolean' },
          { name: 'order_index', label: 'Order', type: 'number' },
        ]}
      />
    </div>
  );
}
