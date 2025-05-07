'use client';

import { useParams } from 'next/navigation';

export default function Mindmap() {
    const params = useParams();
    const id = params?.id;

    return (
        <div>
            Mindmap ID: {id}
        </div>
    );
}