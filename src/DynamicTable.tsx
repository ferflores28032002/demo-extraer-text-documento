import React from "react";

type TableData = {
  headers: string[];
  rows: (string | number | null)[][];
};

type OpsDynamicTableProps = {
  tableName: string;
  data: TableData;
};

const OpsDynamicTable: React.FC<OpsDynamicTableProps> = ({
  tableName,
  data,
}) => {
  return (
    <div className="ops-table-container">
      <h2 className="ops-table-title">{tableName}</h2>
      <table className="ops-dynamic-table">
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={index} style={{ width: `18%` }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => {
            const completeRow = Array.from(
              { length: data.headers.length },
              (_, i) =>
                row[i] !== undefined && row[i] !== null ? row[i] : "No existe"
            );

            return (
              <tr key={rowIndex}>
                {completeRow.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ width: `18%` }}>
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OpsDynamicTable;
