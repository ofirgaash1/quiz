import AnimatedCheckbox from "./AnimatedCheckbox";

export default function EpisodeRow({ ep, showName, seasonNum, selected, onCheckboxToggle, onEdit }) {
    return (
        <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
            {/* Checkbox */}
            <td className="p-4 pl-6 align-middle">
                <AnimatedCheckbox checked={selected} onChange={onCheckboxToggle} />
            </td>

            {/* Episode number */}
            <td className="p-4 align-middle">
                Episode {ep.episode}
            </td>

            {/* Edit button */}
            <td className="p-4 align-middle text-right">
                <button className="text-blue-600 underline" onClick={onEdit}>
                    Edit
                </button>
            </td>
        </tr>
    );
}
