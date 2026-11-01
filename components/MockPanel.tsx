'use client'

type Group = { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }

// Lets reviewers flip between screen states that real data would normally drive.
export function MockPanel({ groups }: { groups: Group[] }) {
  return (
    <details className="mock">
      <summary>สลับสถานะจำลอง</summary>
      <div className="mock-body">
        {groups.map((g) => (
          <div className="field" key={g.label}>
            <label htmlFor={`mock-${g.label}`}>{g.label}</label>
            <select id={`mock-${g.label}`} className="input" value={g.value} onChange={(e) => g.onChange(e.target.value)}>
              {g.options.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </details>
  )
}
