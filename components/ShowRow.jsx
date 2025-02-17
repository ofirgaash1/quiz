import ExpandCollapseIcon from "./ExpandCollapseIcon";
export default function ShowRow({ showName, expanded, onToggle }) {
    return (
      <tr className="bg-gray-200 border-b border-gray-300">
        <td className="p-4 w-12">
          <button onClick={onToggle}>
            <ExpandCollapseIcon expanded={expanded} />
          </button>
        </td>
        {/* colSpan=2 to keep a consistent 3-column layout overall */}
        <td className="p-4 text-xl font-semibold" colSpan={2}>
          {showName}
        </td>
      </tr>
    );
  }