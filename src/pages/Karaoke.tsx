import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Star,
  Volume2,
  VolumeX,
  Users,
  Share
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Karaoke = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(233); // Example duration for "Shape of You"
  const [pitch, setPitch] = useState(85); // Pitch accuracy percentage
  const [timing, setTiming] = useState(92); // Timing accuracy percentage
  const [score, setScore] = useState(88); // Overall score
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mock song data
  const currentSong = {
    id: 1,
    title: "Shape of You",
    artist: "Ed Sheeran",
    difficulty: 2,
    duration: 233,
    lyrics: [
      { time: 0, text: "The club isn't the best place to find a lover" },
      { time: 5, text: "So the bar is where I go" },
      { time: 10, text: "Me and my friends at the table doing shots" },
      { time: 15, text: "Drinking fast and then we talk slow" },
      { time: 20, text: "Come over and start up a conversation" },
      { time: 25, text: "With just me and trust me I'll give it a chance now" }
    ]
  };

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    // Simulate real-time pitch and timing updates
    const interval = setInterval(() => {
      if (isRecording) {
        setPitch(Math.floor(Math.random() * 20) + 80); // 80-100%
        setTiming(Math.floor(Math.random() * 15) + 85); // 85-100%
        setScore(Math.floor((pitch + timing) / 2));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, pitch, timing]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPlaying(true);
      
      toast({
        title: "Recording Started",
        description: "Sing along to the track!",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to record.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPlaying(false);
      
      toast({
        title: "Performance Complete!",
        description: `Final Score: ${score}%`,
      });
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentLyric = () => {
    return currentSong.lyrics.find((lyric, index) => {
      const nextLyric = currentSong.lyrics[index + 1];
      return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Karaoke Studio</h1>
              <p className="text-muted-foreground">Record your performance and share with the world</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="duet">
                <Users className="h-4 w-4" />
                Invite for Duet
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Recording Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Song Info Card */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentSong.title}</CardTitle>
                    <p className="text-lg text-muted-foreground">{currentSong.artist}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      Difficulty: {Array.from({ length: currentSong.difficulty }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current inline" />
                      ))}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Duration: {formatTime(currentSong.duration)}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Audio Visualizer */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg p-8 text-center">
                  <div className="mb-6">
                    <canvas 
                      ref={canvasRef}
                      width="400" 
                      height="100"
                      className="w-full h-24 border rounded bg-black/20"
                    />
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2 mb-6">
                    <Progress value={(currentTime / duration) * 100} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentTime(0)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant={isRecording ? "record" : "neon"}
                      size="fab"
                      onClick={isRecording ? stopRecording : startRecording}
                      className="relative"
                    >
                      {isRecording ? (
                        <MicOff className="h-6 w-6" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                      {isRecording && (
                        <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-25"></div>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lyrics Display */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Lyrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-2xl font-medium leading-relaxed">
                    {getCurrentLyric()?.text || "♪ Music starts in 3... 2... 1... ♪"}
                  </p>
                </div>
                
                {/* Upcoming lyrics */}
                <div className="border-t pt-4 space-y-2">
                  {currentSong.lyrics.slice(0, 3).map((lyric, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {lyric.text}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Performance Stats */}
          <div className="space-y-6">
            
            {/* Real-time Performance */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Score</span>
                    <span className="font-bold text-primary">{score}%</span>
                  </div>
                  <Progress value={score} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Pitch Accuracy</span>
                    <span className="font-bold text-neon-blue">{pitch}%</span>
                  </div>
                  <Progress value={pitch} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Timing</span>
                    <span className="font-bold text-neon-green">{timing}%</span>
                  </div>
                  <Progress value={timing} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recording Settings */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recording Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vocal Volume</label>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Music Volume</label>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reverb</label>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Echo</label>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" disabled={!isRecording}>
                  <Share className="h-4 w-4" />
                  Share Live
                </Button>
                
                <Button variant="secondary" className="w-full">
                  Save as Draft
                </Button>
                
                <Button variant="neon" className="w-full" disabled={isRecording}>
                  Publish Performance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Karaoke;