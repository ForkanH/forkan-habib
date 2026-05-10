'use client';
import { CrudTable } from '@/components/admin/crud-table';
export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Testimonials</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage testimonials content shown on the public site.</p>
      <CrudTable
        table="testimonials"
        orderBy="order_index"
        allowReorder
        columns={['name','company','rating','is_visible']}
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'role', label: 'Role', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'photo_url', label: 'Photo', type: 'image', bucket: 'avatars' },
          { name: 'text', label: 'Quote', type: 'textarea' },
          { name: 'rating', label: 'Rating 1-5', type: 'number' },
          { name: 'is_visible', label: 'Visible', type: 'boolean' },
          { name: 'order_index', label: 'Order', type: 'number' },
        ]}
      />
    </div>
  );
}
