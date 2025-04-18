import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Clock, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

export function AnalyticsDashboard({ entries }) {
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = new Date(entry.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(entriesByDate).map(([date, count]) => ({
    date,
    entries: count,
  }));

  const stats = [
    {
      icon: <Calendar className="text-blue-500" />,
      label: 'Total Entries',
      value: entries.length,
    },
    {
      icon: <TrendingUp className="text-green-500" />,
      label: 'Streak',
      value: '5 days',
    },
    {
      icon: <Clock className="text-purple-500" />,
      label: 'Avg. Length',
      value: `${Math.round(entries.reduce((acc, entry) => acc + entry.content.length, 0) / entries.length)} chars`,
    },
    {
      icon: <Hash className="text-yellow-500" />,
      label: 'Total Tags',
      value: new Set(entries.flatMap(entry => entry.tags)).size,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card-bg border border-card-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-background">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Writing Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-card-border rounded-lg p-2 shadow-lg">
                        <p className="text-sm">{label}</p>
                        <p className="text-sm font-semibold">
                          {payload[0].value} entries
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="var(--color-sapphire)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 