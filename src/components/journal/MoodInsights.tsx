import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function MoodInsights({ entries }) {
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(moodCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = {
    Happy: 'var(--mood-happy)',
    Calm: 'var(--mood-calm)',
    Energetic: 'var(--mood-energetic)',
    Reflective: 'var(--mood-reflective)',
    Neutral: 'var(--mood-neutral)',
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Mood Insights</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-card-border rounded-lg p-2 shadow-lg">
                      <p className="text-sm">
                        {payload[0].name}: {payload[0].value} entries
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.entries(COLORS).map(([mood, color]) => (
          <div key={mood} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 