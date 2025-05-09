'use client';

import React, { JSX } from 'react';
import { useParams } from 'next/navigation';

export default function Mindmap(): JSX.Element {
    const params = useParams();
    const id = params?.id;

    return (
        <div>
            Mindmap ID: {id}
        </div>
    );
}