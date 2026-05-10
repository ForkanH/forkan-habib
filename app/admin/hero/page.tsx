'use client';
import { CrudTable } from '@/components/admin/crud-table';
export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Hero stats</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage hero stats content shown on the public site.</p>
      <CrudTable
        table="hero_stats"
        orderBy="order_index"
        allowReorder
        columns={['label','value','order_index']}
        fields={[
          { name: 'label', label: 'Label', type: 'text', required: true },
          { name: 'value', label: 'Value', type: 'text', required: true },
          { name: 'order_index', label: 'Order', type: 'number' },
        ]}
      />
    </div>
  );
}
