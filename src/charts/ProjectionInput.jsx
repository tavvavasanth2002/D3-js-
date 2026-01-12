export default function ProjectionInput({ projections, value, onChange }) {
  return (
    <label>
      Projection:{" "}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {projections.map(p => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
