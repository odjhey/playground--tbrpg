type TProps = { participants: string[] };
export default ({ participants }: TProps) => {
  return (
    <table className="table table-zebra table-compact">
      <tbody>
        {participants.map((v, i) => {
          return (
            <tr key={i}>
              <td>{v}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
