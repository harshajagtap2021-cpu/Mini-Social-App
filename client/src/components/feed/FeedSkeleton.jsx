import { Card, CardContent, Skeleton, Stack } from "@mui/material";

/** Placeholder layout while the first feed page loads (perceived performance). */
export default function FeedSkeleton({ rows = 3 }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: rows }, (_, i) => (
        <Card key={i} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Skeleton variant="circular" width={44} height={44} />
              <Stack spacing={0.5} flex={1}>
                <Skeleton width="40%" />
                <Skeleton width="25%" />
              </Stack>
            </Stack>
            <Skeleton variant="rounded" height={72} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={180} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
