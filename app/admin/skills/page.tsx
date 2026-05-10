'use client';
import { CrudTable } from '@/components/admin/crud-table';
export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Skills</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage skills content shown on the public site.</p>
      <CrudTable
        table="skills"
        orderBy="order_index"
        allowReorder
        columns={['name','category','proficiency','order_index']}
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'category', label: 'Category', type: 'select', options: ['AI & Automation','Infrastructure','Dev Tools','Design & Marketing'] },
          { name: 'icon', label: 'Icon (lucide name)', type: 'text' },
          { name: 'proficiency', label: 'Proficiency 0-100', type: 'number' },
          { name: 'order_index', label: 'Order', type: 'number' },
        ]}
      />
    </div>
  );
}
