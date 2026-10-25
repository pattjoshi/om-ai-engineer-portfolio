'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      value: 'omprakashpattjoshi123@gmail.com',
      href: 'mailto:omprakashpattjoshi123@gmail.com',
      color: 'text-blue-600',
      copy: true,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Phone',
      value: '+91 90784 45836',
      href: 'tel:+919078445836',
      color: 'text-green-600',
      copy: true,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Location',
      value: 'India',
      href: '#',
      color: 'text-purple-600',
      copy: false,
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      title: 'LinkedIn',
      value: 'om-prakash-pattjoshi',
      href: 'https://www.linkedin.com/in/om-prakash-pattjoshi-/',
      color: 'text-blue-700',
      copy: false,
    },
    {
      icon: <Github className="h-5 w-5" />,
      title: 'GitHub',
      value: 'pattjoshi',
      href: 'https://github.com/pattjoshi',
      color: 'text-gray-800',
      copy: false,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Get in Touch</h2>
        <p className="text-muted-foreground">
          I'm always excited to connect with fellow tech enthusiasts, discuss opportunities, or just chat about the latest in GenAI and LLM engineering!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactInfo.map((contact, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${contact.color}`}>
                  {contact.icon}
                </div>
                <CardTitle className="text-lg">{contact.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base font-medium mb-3">
                {contact.value}
              </CardDescription>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  contact.copy
                    ? copyToClipboard(contact.value, contact.title)
                    : window.open(contact.href, '_blank')
                }
              >
                {contact.copy
                  ? 'Copy'
                  : contact.title === 'Location'
                    ? 'View on Map'
                    : `Open ${contact.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-4 pt-6">
        <div className="bg-accent rounded-lg p-6">
          <h3 className="font-semibold mb-2">What I'm Looking For</h3>
          <p className="text-sm text-muted-foreground">
            • GenAI & LLM Engineering opportunities • RAG & Agentic AI projects • Full-stack AI development roles •
            Open source contributions • Tech community connections
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Feel free to reach out for collaborations, job opportunities, or just to discuss the latest in tech! 
          I'm particularly interested in projects that combine AI/ML with real-world impact.
        </p>
      </div>
    </div>
  );
}
