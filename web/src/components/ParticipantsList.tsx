type TProps = { participants: { name: string; stats: any }[] };
export default ({ participants }: TProps) => {
  return (
    <table className="table table-zebra table-compact">
      <tbody>
        {participants.map((v, i) => {
          return (
            <tr key={i}>
              <td>
                {v.name} <pre>{JSON.stringify(v.stats)}</pre>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
